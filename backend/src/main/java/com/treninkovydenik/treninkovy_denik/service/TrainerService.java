package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.model.TrainerReview;
import com.treninkovydenik.treninkovy_denik.model.Message;
import com.treninkovydenik.treninkovy_denik.model.TrainingPlan;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.repository.TrainerReviewRepository;
import com.treninkovydenik.treninkovy_denik.repository.MessageRepository;
import com.treninkovydenik.treninkovy_denik.repository.TrainingPlanRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class TrainerService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerReviewRepository trainerReviewRepository;

    @Autowired
    private MessageRepository messageRepository;

    @Autowired
    private TrainingPlanRepository trainingPlanRepository;

    public List<User> getAllTrainers() {
        return userRepository.findByRole("TRAINER");
    }

    public Optional<User> getTrainerById(Long id) {
        return userRepository.findById(id)
            .filter(user -> "TRAINER".equals(user.getRole()));
    }

    @Transactional
    public TrainerReview addReview(User trainer, User user, Integer rating, String comment) {
        if (trainerReviewRepository.existsByTrainerAndUser(trainer, user)) {
            throw new RuntimeException("Uživatel již hodnotil tohoto trenéra");
        }

        TrainerReview review = new TrainerReview();
        review.setTrainer(trainer);
        review.setUser(user);
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());

        return trainerReviewRepository.save(review);
    }

    public List<TrainerReview> getTrainerReviews(User trainer) {
        return trainerReviewRepository.findByTrainer(trainer);
    }

    @Transactional
    public Message sendMessage(User sender, User receiver, String content) {
        Message message = new Message();
        message.setSender(sender);
        message.setReceiver(receiver);
        message.setContent(content);
        message.setCreatedAt(LocalDateTime.now());
        message.setRead(false);

        return messageRepository.save(message);
    }

    public List<Message> getConversation(User user1, User user2) {
        return messageRepository.findBySenderAndReceiver(user1, user2);
    }

    public List<Message> getUnreadMessages(User user) {
        return messageRepository.findByReceiverAndReadFalse(user);
    }

    @Transactional
    public TrainingPlan createTrainingPlan(User trainer, User user, String title, String description) {
        TrainingPlan plan = new TrainingPlan();
        plan.setTrainer(trainer);
        plan.setUser(user);
        plan.setTitle(title);
        plan.setDescription(description);
        plan.setCreatedAt(LocalDateTime.now());
        plan.setAccepted(false);

        return trainingPlanRepository.save(plan);
    }

    public List<TrainingPlan> getUserTrainingPlans(User user) {
        return trainingPlanRepository.findByUser(user);
    }

    public List<TrainingPlan> getTrainerTrainingPlans(User trainer) {
        return trainingPlanRepository.findByTrainer(trainer);
    }

    @Transactional
    public TrainingPlan acceptTrainingPlan(Long planId) {
        TrainingPlan plan = trainingPlanRepository.findById(planId)
            .orElseThrow(() -> new RuntimeException("Tréninkový plán nenalezen"));
        
        plan.setAccepted(true);
        return trainingPlanRepository.save(plan);
    }
} 