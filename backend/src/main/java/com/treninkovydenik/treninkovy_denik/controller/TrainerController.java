package com.treninkovydenik.treninkovy_denik.controller;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.model.TrainerReview;
import com.treninkovydenik.treninkovy_denik.model.Message;
import com.treninkovydenik.treninkovy_denik.model.TrainingPlan;
import com.treninkovydenik.treninkovy_denik.service.TrainerService;
import com.treninkovydenik.treninkovy_denik.service.UserService;
import com.treninkovydenik.treninkovy_denik.dto.TrainerReviewDTO;
import com.treninkovydenik.treninkovy_denik.dto.MessageDTO;
import com.treninkovydenik.treninkovy_denik.dto.TrainingPlanDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

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

    @PostMapping("/{trainerId}/reviews")
    public ResponseEntity<TrainerReviewDTO> addReview(
            @PathVariable Long trainerId,
            @RequestBody TrainerReviewDTO reviewDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
        
        User trainer = trainerService.getTrainerById(trainerId)
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

        TrainerReview review = trainerService.addReview(
            trainer, user, reviewDTO.getRating(), reviewDTO.getComment());

        TrainerReviewDTO responseDTO = new TrainerReviewDTO();
        responseDTO.setId(review.getId());
        responseDTO.setTrainerId(review.getTrainer().getId());
        responseDTO.setUserId(review.getUser().getId());
        responseDTO.setRating(review.getRating());
        responseDTO.setComment(review.getComment());
        responseDTO.setCreatedAt(review.getCreatedAt().toString());
        responseDTO.setTrainerName(review.getTrainer().getName() + " " + review.getTrainer().getSurname());
        responseDTO.setUserName(review.getUser().getName() + " " + review.getUser().getSurname());

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{trainerId}/reviews")
    public ResponseEntity<List<TrainerReviewDTO>> getTrainerReviews(@PathVariable Long trainerId) {
        User trainer = trainerService.getTrainerById(trainerId)
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

        List<TrainerReviewDTO> reviews = trainerService.getTrainerReviews(trainer).stream()
            .map(review -> {
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
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(reviews);
    }

    @PostMapping("/{trainerId}/messages")
    public ResponseEntity<MessageDTO> sendMessage(
            @PathVariable Long trainerId,
            @RequestBody MessageDTO messageDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User sender = userService.findByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
        
        User receiver = trainerService.getTrainerById(trainerId)
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

        Message message = trainerService.sendMessage(sender, receiver, messageDTO.getContent());

        MessageDTO responseDTO = new MessageDTO();
        responseDTO.setId(message.getId());
        responseDTO.setSenderId(message.getSender().getId());
        responseDTO.setReceiverId(message.getReceiver().getId());
        responseDTO.setContent(message.getContent());
        responseDTO.setCreatedAt(message.getCreatedAt().toString());
        responseDTO.setRead(message.isRead());
        responseDTO.setSenderName(message.getSender().getName() + " " + message.getSender().getSurname());
        responseDTO.setReceiverName(message.getReceiver().getName() + " " + message.getReceiver().getSurname());

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/{trainerId}/messages")
    public ResponseEntity<List<MessageDTO>> getConversation(@PathVariable Long trainerId) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
        
        User trainer = trainerService.getTrainerById(trainerId)
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

        List<MessageDTO> messages = trainerService.getConversation(user, trainer).stream()
            .map(message -> {
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
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(messages);
    }

    @PostMapping("/{trainerId}/training-plans")
    public ResponseEntity<TrainingPlanDTO> createTrainingPlan(
            @PathVariable Long trainerId,
            @RequestBody TrainingPlanDTO planDTO) {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
        
        User trainer = trainerService.getTrainerById(trainerId)
            .orElseThrow(() -> new RuntimeException("Trenér nenalezen"));

        TrainingPlan plan = trainerService.createTrainingPlan(
            trainer, user, planDTO.getTitle(), planDTO.getDescription());

        TrainingPlanDTO responseDTO = new TrainingPlanDTO();
        responseDTO.setId(plan.getId());
        responseDTO.setTrainerId(plan.getTrainer().getId());
        responseDTO.setUserId(plan.getUser().getId());
        responseDTO.setTitle(plan.getTitle());
        responseDTO.setDescription(plan.getDescription());
        responseDTO.setCreatedAt(plan.getCreatedAt().toString());
        responseDTO.setAccepted(plan.isAccepted());
        responseDTO.setTrainerName(plan.getTrainer().getName() + " " + plan.getTrainer().getSurname());
        responseDTO.setUserName(plan.getUser().getName() + " " + plan.getUser().getSurname());

        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping("/training-plans")
    public ResponseEntity<List<TrainingPlanDTO>> getTrainingPlans() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        User user = userService.findByEmail(auth.getName())
            .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));

        List<TrainingPlanDTO> plans = trainerService.getUserTrainingPlans(user).stream()
            .map(plan -> {
                TrainingPlanDTO dto = new TrainingPlanDTO();
                dto.setId(plan.getId());
                dto.setTrainerId(plan.getTrainer().getId());
                dto.setUserId(plan.getUser().getId());
                dto.setTitle(plan.getTitle());
                dto.setDescription(plan.getDescription());
                dto.setCreatedAt(plan.getCreatedAt().toString());
                dto.setAccepted(plan.isAccepted());
                dto.setTrainerName(plan.getTrainer().getName() + " " + plan.getTrainer().getSurname());
                dto.setUserName(plan.getUser().getName() + " " + plan.getUser().getSurname());
                return dto;
            })
            .collect(Collectors.toList());

        return ResponseEntity.ok(plans);
    }

    @PostMapping("/training-plans/{planId}/accept")
    public ResponseEntity<TrainingPlanDTO> acceptTrainingPlan(@PathVariable Long planId) {
        TrainingPlan plan = trainerService.acceptTrainingPlan(planId);

        TrainingPlanDTO responseDTO = new TrainingPlanDTO();
        responseDTO.setId(plan.getId());
        responseDTO.setTrainerId(plan.getTrainer().getId());
        responseDTO.setUserId(plan.getUser().getId());
        responseDTO.setTitle(plan.getTitle());
        responseDTO.setDescription(plan.getDescription());
        responseDTO.setCreatedAt(plan.getCreatedAt().toString());
        responseDTO.setAccepted(plan.isAccepted());
        responseDTO.setTrainerName(plan.getTrainer().getName() + " " + plan.getTrainer().getSurname());
        responseDTO.setUserName(plan.getUser().getName() + " " + plan.getUser().getSurname());

        return ResponseEntity.ok(responseDTO);
    }
} 