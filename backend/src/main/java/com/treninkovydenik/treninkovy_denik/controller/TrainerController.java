package com.treninkovydenik.treninkovy_denik.controller;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.model.TrainerReview;
import com.treninkovydenik.treninkovy_denik.model.Message;
import com.treninkovydenik.treninkovy_denik.service.TrainerService;
import com.treninkovydenik.treninkovy_denik.service.UserService;
import com.treninkovydenik.treninkovy_denik.dto.TrainerReviewDTO;
import com.treninkovydenik.treninkovy_denik.dto.MessageDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;
import com.treninkovydenik.treninkovy_denik.dto.ConversationDTO;

import java.util.List;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {
    private final TrainerService trainerService;
    private final UserService userService;

    public TrainerController(TrainerService trainerService, UserService userService) {
        this.trainerService = trainerService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<User>> getAllTrainers() {
        return ResponseEntity.ok(trainerService.getAllTrainers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getTrainerById(@PathVariable Long id) {
        return trainerService.getTrainerById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/{id}/reviews")
    public ResponseEntity<List<TrainerReviewDTO>> getTrainerReviews(@PathVariable Long id) {
        User trainer = trainerService.getTrainerById(id)
            .orElseThrow(() -> new RuntimeException("Trainer not found"));

        List<TrainerReviewDTO> reviews = trainerService.getTrainerReviews(trainer).stream()
            .map(this::convertToReviewDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{id}/reviews")
    public ResponseEntity<TrainerReviewDTO> addReview(
        @PathVariable Long id,
        @RequestBody TrainerReviewDTO reviewDTO
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User currentUser = userService.getUserByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("User not found"));

        User trainer = trainerService.getTrainerById(id)
            .orElseThrow(() -> new RuntimeException("Trainer not found"));

        TrainerReview review = trainerService.addReview(
            trainer,
            currentUser,
            reviewDTO.getRating(),
            reviewDTO.getComment()
        );

        return ResponseEntity.ok(convertToReviewDTO(review));
    }

    @GetMapping("/{id}/messages")
    public ResponseEntity<List<MessageDTO>> getMessages(@PathVariable Long id) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User trainer = userService.getUserByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("Trainer not found"));

        User otherUser = userService.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        // Marking messages as read
        trainerService.markMessagesAsRead(trainer, otherUser);

        List<MessageDTO> messages = trainerService.getConversation(trainer, otherUser).stream()
            .map(this::convertToMessageDTO)
            .collect(Collectors.toList());

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{id}/messages")
    public ResponseEntity<MessageDTO> sendMessage(
        @PathVariable Long id,
        @RequestBody MessageDTO messageDTO
    ) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User trainer = userService.getUserByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("Trainer not found"));

        User user = userService.findById(id)
            .orElseThrow(() -> new RuntimeException("User not found"));

        Message message = trainerService.sendMessage(
            trainer,
            user,
            messageDTO.getContent()
        );

        return ResponseEntity.ok(convertToMessageDTO(message));
    }

    @GetMapping("/conversations")
    public ResponseEntity<List<ConversationDTO>> getTrainerConversations() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User trainer = userService.getUserByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

        List<Message> allMessages = trainerService.getTrainerConversations(trainer);
        Map<Long, ConversationDTO> conversationsMap = new HashMap<>();

        for (Message message : allMessages) {
            User otherUser = message.getSender().getId().equals(trainer.getId()) 
                ? message.getReceiver() 
                : message.getSender();
            
            if (!conversationsMap.containsKey(otherUser.getId())) {
                ConversationDTO conversation = new ConversationDTO();
                conversation.setSenderId(otherUser.getId());
                conversation.setSenderName(otherUser.getName() + " " + otherUser.getSurname());
                conversation.setLastMessage(message.getContent());
                conversation.setLastMessageTime(message.getCreatedAt());
                conversation.setUnreadCount(0);
                conversationsMap.put(otherUser.getId(), conversation);
            }

            ConversationDTO conversation = conversationsMap.get(otherUser.getId());
            if (message.getCreatedAt().isAfter(conversation.getLastMessageTime())) {
                conversation.setLastMessage(message.getContent());
                conversation.setLastMessageTime(message.getCreatedAt());
            }
            if (!message.isRead() && message.getReceiver().getId().equals(trainer.getId())) {
                conversation.setUnreadCount(conversation.getUnreadCount() + 1);
            }
        }

        List<ConversationDTO> conversations = new ArrayList<>(conversationsMap.values());
        conversations.sort((a, b) -> b.getLastMessageTime().compareTo(a.getLastMessageTime()));

        return ResponseEntity.ok(conversations);
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateDescription(@RequestBody Map<String, String> request) {
        try {
            Authentication auth = SecurityContextHolder.getContext().getAuthentication();
            User trainer = userService.getUserByEmail(auth.getName())
                .orElseThrow(() -> new RuntimeException("Trainer not found"));

            // Check if user is trainer
            if (!"TRAINER".equals(trainer.getRole())) {
                return ResponseEntity.status(403).body("Access denied - only trainers can edit their description");
            }

            // Update only description 
            trainer.setDescription(request.get("description"));
            trainer = userService.saveUser(trainer);
            
            return ResponseEntity.ok(Map.of("description", trainer.getDescription()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    private TrainerReviewDTO convertToReviewDTO(TrainerReview review) {
        TrainerReviewDTO dto = new TrainerReviewDTO();
        dto.setId(review.getId());
        dto.setTrainerId(review.getTrainer().getId());
        dto.setUserId(review.getUser().getId());
        dto.setRating(review.getRating());
        dto.setComment(review.getComment());
        dto.setCreatedAt(review.getCreatedAt().toString());
        dto.setTrainerName(review.getTrainer().getName() + " " + review.getTrainer().getSurname());
        dto.setUserName(review.getUser().getName() + " " + review.getUser().getSurname());
        return dto;
    }

    private MessageDTO convertToMessageDTO(Message message) {
        MessageDTO dto = new MessageDTO();
        dto.setId(message.getId());
        dto.setSenderId(message.getSender().getId());
        dto.setReceiverId(message.getReceiver().getId());
        dto.setContent(message.getContent());
        dto.setCreatedAt(message.getCreatedAt().toString());
        dto.setRead(message.isRead());
        dto.setSenderName(message.getSender().getName() + " " + message.getSender().getSurname());
        dto.setReceiverName(message.getReceiver().getName() + " " + message.getReceiver().getSurname());
        return dto;
    }
} 