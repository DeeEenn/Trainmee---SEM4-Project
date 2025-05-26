package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.model.Progress;
import com.treninkovydenik.treninkovy_denik.repository.ProgressRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;

@Service
public class UserService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);
    
    private final UserRepository userRepository;
    private final ProgressRepository progressRepository;

    public UserService(UserRepository userRepository, ProgressRepository progressRepository) {
        this.userRepository = userRepository;
        this.progressRepository = progressRepository;
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Optional<User> findById(Long id) {
        return userRepository.findById(id);
    }

    @Transactional
    public User updateUserProfile(User user) {
        logger.info("Updating user profile for user: {}", user.getId());
        User savedUser = userRepository.save(user);
        
        // Always create new progress entry when profile is updated
        if (user.getWeight() > 0) {
            Progress progress = new Progress();
            progress.setUser(user);
            progress.setDate(LocalDate.now());
            progress.setWeight(user.getWeight());
            progress.setBodyFatPercentage(user.getBodyFatPercentage());
            progress.setNotes("Profile updated automatically");
            Progress savedProgress = progressRepository.save(progress);
            logger.info("Created new progress entry with id: {} for user: {}", savedProgress.getId(), user.getId());
        }
        
        return savedUser;
    }

    public Optional<User> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public User saveUser(User user) {
        return userRepository.save(user);
    }
} 