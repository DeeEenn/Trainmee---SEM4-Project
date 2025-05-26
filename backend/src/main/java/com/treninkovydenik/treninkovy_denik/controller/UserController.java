package com.treninkovydenik.treninkovy_denik.controller;

import com.treninkovydenik.treninkovy_denik.dto.UserProfileDto;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.service.UserService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);
    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            logger.info("Authentication: {}", authentication);
            
            String email = authentication.getName();
            logger.info("User email from authentication: {}", email);
            
            User user = userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            logger.info("Found user: {}", user);
                
            UserProfileDto userProfile = new UserProfileDto(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getBodyFatPercentage(),
                user.getWeight(),
                user.getHeight(),
                user.getProfilePictureUrl(),
                user.getDescription()
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
            
            User user = userService.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            logger.info("Found user: {}", user);

            // Update user data
            user.setName(profileDto.getName());
            user.setSurname(profileDto.getSurname());
            user.setBodyFatPercentage(profileDto.getBodyFatPercentage());
            user.setWeight(profileDto.getWeight());
            user.setHeight(profileDto.getHeight());
            
            user = userService.updateUserProfile(user);
            logger.info("Updated user: {}", user);
            
            UserProfileDto updatedProfile = new UserProfileDto(
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.getEmail(),
                user.getBodyFatPercentage(),
                user.getWeight(),
                user.getHeight(),
                user.getProfilePictureUrl(),
                user.getDescription()
            );
            logger.info("Returning updated profile: {}", updatedProfile);
            
            return ResponseEntity.ok(updatedProfile);
        } catch (Exception e) {
            logger.error("Error in updateProfile: ", e);
            throw e;
        }
    }
} 