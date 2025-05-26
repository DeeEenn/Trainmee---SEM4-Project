package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.model.TrainerReview;
import com.treninkovydenik.treninkovy_denik.model.Message;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.repository.TrainerReviewRepository;
import com.treninkovydenik.treninkovy_denik.repository.MessageRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TrainerServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private TrainerReviewRepository trainerReviewRepository;

    @Mock
    private MessageRepository messageRepository;

    private TrainerService trainerService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        trainerService = new TrainerService(userRepository, trainerReviewRepository, messageRepository);
    }

    @Test
    void getAllTrainers_ReturnsTrainers() {
        List<User> trainers = new ArrayList<>();
        User trainer = new User();
        trainer.setRole("TRAINER");
        trainers.add(trainer);
        when(userRepository.findByRole("TRAINER")).thenReturn(trainers);

        List<User> result = trainerService.getAllTrainers();
        assertNotNull(result);
        assertEquals(1, result.size());
        assertEquals("TRAINER", result.get(0).getRole());
        verify(userRepository).findByRole("TRAINER");
    }

    @Test
    void getTrainerById_ExistingTrainer_ReturnsTrainer() {
        Long trainerId = 1L;
        User trainer = new User();
        trainer.setId(trainerId);
        trainer.setRole("TRAINER");
        when(userRepository.findById(trainerId)).thenReturn(Optional.of(trainer));

        Optional<User> result = trainerService.getTrainerById(trainerId);

        assertTrue(result.isPresent());
        assertEquals(trainerId, result.get().getId());
        assertEquals("TRAINER", result.get().getRole());
        verify(userRepository).findById(trainerId);
    }

    @Test
    void getTrainerById_NonTrainer_ReturnsEmpty() {
        Long userId = 1L;
        User user = new User();
        user.setId(userId);
        user.setRole("USER");
        when(userRepository.findById(userId)).thenReturn(Optional.of(user));

        Optional<User> result = trainerService.getTrainerById(userId);

        assertTrue(result.isEmpty());
        verify(userRepository).findById(userId);
    }

    @Test
    void addReview_NewReview_Success() {
        // Arrange
        User trainer = new User();
        trainer.setId(1L);
        trainer.setRole("TRAINER");

        User user = new User();
        user.setId(2L);
        user.setRole("USER");

        when(trainerReviewRepository.existsByTrainerAndUser(trainer, user)).thenReturn(false);
        when(trainerReviewRepository.save(any(TrainerReview.class))).thenAnswer(i -> i.getArguments()[0]);

        // Act
        TrainerReview review = trainerService.addReview(trainer, user, 5, "Great trainer!");

        // Assert
        assertNotNull(review);
        assertEquals(trainer, review.getTrainer());
        assertEquals(user, review.getUser());
        assertEquals(5, review.getRating());
        assertEquals("Great trainer!", review.getComment());
        assertNotNull(review.getCreatedAt());
        verify(trainerReviewRepository).save(any(TrainerReview.class));
    }

    @Test
    void addReview_ExistingReview_ThrowsException() {
        User trainer = new User();
        User user = new User();
        when(trainerReviewRepository.existsByTrainerAndUser(trainer, user)).thenReturn(true);

        assertThrows(RuntimeException.class, () -> 
            trainerService.addReview(trainer, user, 5, "Great trainer!"));
    }

    @Test
    void getTrainerReviews_ReturnsReviews() {
        User trainer = new User();
        List<TrainerReview> reviews = new ArrayList<>();
        reviews.add(new TrainerReview());
        when(trainerReviewRepository.findByTrainer(trainer)).thenReturn(reviews);

        List<TrainerReview> result = trainerService.getTrainerReviews(trainer);

        assertNotNull(result);
        assertEquals(reviews.size(), result.size());
        verify(trainerReviewRepository).findByTrainer(trainer);
    }

    @Test
    void getConversation_ReturnsMessages() {
        User user1 = new User();
        User user2 = new User();
        List<Message> messages1 = new ArrayList<>();
        List<Message> messages2 = new ArrayList<>();
        when(messageRepository.findBySenderAndReceiver(user1, user2)).thenReturn(messages1);
        when(messageRepository.findBySenderAndReceiver(user2, user1)).thenReturn(messages2);

        List<Message> result = trainerService.getConversation(user1, user2);

        assertNotNull(result);
        assertEquals(messages1.size() + messages2.size(), result.size());
        verify(messageRepository).findBySenderAndReceiver(user1, user2);
        verify(messageRepository).findBySenderAndReceiver(user2, user1);
    }
} 