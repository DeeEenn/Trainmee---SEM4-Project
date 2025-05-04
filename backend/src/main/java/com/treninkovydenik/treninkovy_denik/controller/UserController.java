package com.treninkovydenik.treninkovy_denik.controller;

import com.treninkovydenik.treninkovy_denik.dto.UserProfileDto;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            logger.info("Authentication: {}", authentication);
            
            String email = authentication.getName();
            logger.info("User email from authentication: {}", email);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
            logger.info("Found user: {}", user);
                
            UserProfileDto userProfile = new UserProfileDto(
                user.getName(),
                user.getSurname(),
                user.getEmail()
            );
            logger.info("Returning user profile: {}", userProfile);
                
            return ResponseEntity.ok(userProfile);
        } catch (Exception e) {
            logger.error("Error in getProfile: ", e);
            throw e;
        }
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody UserProfileDto profileDto) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            logger.info("Authentication: {}", authentication);
            
            String email = authentication.getName();
            logger.info("User email from authentication: {}", email);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
            logger.info("Found user: {}", user);

            // Aktualizace dat uživatele - email se nemění
            user.setName(profileDto.getName());
            user.setSurname(profileDto.getSurname());
            
            user = userRepository.save(user);
            logger.info("Updated user: {}", user);
            
            UserProfileDto updatedProfile = new UserProfileDto(
                user.getName(),
                user.getSurname(),
                user.getEmail() // Vracíme původní email
            );
            logger.info("Returning updated profile: {}", updatedProfile);
            
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            logger.error("Error in updateProfile: ", e);
            throw e;
        }
    }
} 