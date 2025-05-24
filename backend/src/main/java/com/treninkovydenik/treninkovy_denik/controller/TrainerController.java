package com.treninkovydenik.treninkovy_denik.controller;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.model.TrainerReview;
import com.treninkovydenik.treninkovy_denik.model.Message;
import com.treninkovydenik.treninkovy_denik.service.TrainerService;
import com.treninkovydenik.treninkovy_denik.service.UserService;
import com.treninkovydenik.treninkovy_denik.dto.TrainerReviewDTO;
import com.treninkovydenik.treninkovy_denik.dto.MessageDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.HashMap;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/trainers")
public class TrainerController {
    @Autowired
    private TrainerService trainerService;

    @Autowired
    private UserService userService;

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
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

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
            .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

        User trainer = trainerService.getTrainerById(id)
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

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
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

        User otherUser = userService.findById(id)
            .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

        // Označíme zprávy jako přečtené
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
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

        User user = userService.findById(id)
            .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

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
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

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

    private static class ConversationDTO {
        private Long senderId;
        private String senderName;
        private String lastMessage;
        private LocalDateTime lastMessageTime;
        private int unreadCount;

        // Getters and setters
        public Long getSenderId() { return senderId; }
        public void setSenderId(Long senderId) { this.senderId = senderId; }
        public String getSenderName() { return senderName; }
        public void setSenderName(String senderName) { this.senderName = senderName; }
        public String getLastMessage() { return lastMessage; }
        public void setLastMessage(String lastMessage) { this.lastMessage = lastMessage; }
        public LocalDateTime getLastMessageTime() { return lastMessageTime; }
        public void setLastMessageTime(LocalDateTime lastMessageTime) { this.lastMessageTime = lastMessageTime; }
        public int getUnreadCount() { return unreadCount; }
        public void setUnreadCount(int unreadCount) { this.unreadCount = unreadCount; }
    }
} 