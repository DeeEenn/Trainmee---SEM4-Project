package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.model.TrainerReview;
import com.treninkovydenik.treninkovy_denik.model.Message;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.repository.TrainerReviewRepository;
import com.treninkovydenik.treninkovy_denik.repository.MessageRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.ArrayList;

@Service
public class TrainerService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private TrainerReviewRepository trainerReviewRepository;

    @Autowired
    private MessageRepository messageRepository;

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
        List<Message> messages1 = messageRepository.findBySenderAndReceiver(user1, user2);
        List<Message> messages2 = messageRepository.findBySenderAndReceiver(user2, user1);
        
        List<Message> allMessages = new ArrayList<>();
        allMessages.addAll(messages1);
        allMessages.addAll(messages2);
        
        // Seřadíme zprávy podle času
        allMessages.sort((a, b) -> a.getCreatedAt().compareTo(b.getCreatedAt()));
        
        return allMessages;
    }

    public List<Message> getUnreadMessages(User user) {
        return messageRepository.findByReceiverAndReadFalse(user);
    }

    public List<Message> getTrainerConversations(User trainer) {
        return messageRepository.findDistinctConversationsByTrainer(trainer);
    }

    @Transactional
    public void markMessagesAsRead(User user1, User user2) {
        List<Message> unreadMessages = messageRepository.findBySenderAndReceiverAndReadFalse(user2, user1);
        for (Message message : unreadMessages) {
            message.setRead(true);
            messageRepository.save(message);
        }
    }
} 