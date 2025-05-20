package com.treninkovydenik.treninkovy_denik.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import com.treninkovydenik.treninkovy_denik.service.ProgressService;
import com.treninkovydenik.treninkovy_denik.dto.ProgressDTO;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.service.UserService;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private static final Logger logger = LoggerFactory.getLogger(ProgressController.class);
    private final ProgressService progressService;
    private final UserService userService;

    public ProgressController(ProgressService progressService, UserService userService) {
        this.progressService = progressService;
        this.userService = userService;
    }

    private User getUserFromAuthentication(Authentication authentication) {
        logger.info("Authentication: {}", authentication);
        String email = authentication.getName();
        logger.info("User email from authentication: {}", email);
        return userService.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<ProgressDTO> createProgress(@RequestBody ProgressDTO progressDTO, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        progressDTO.setUserId(user.getId());
        return ResponseEntity.ok(progressService.createProgress(progressDTO));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressDTO>> getUserMeasurements(
            @PathVariable Long userId,
            @RequestParam(required = false) LocalDate startDate,
            @RequestParam(required = false) LocalDate endDate,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        logger.info("Checking access for user {} to measurements of user {}", user.getId(), userId);
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to user measurements");
        }
        return ResponseEntity.ok(progressService.getUserMeasurements(userId, startDate, endDate));
    }

    @GetMapping("/user/{userId}/training-stats")
    public ResponseEntity<Map<String, Object>> getTrainingStats(
            @PathVariable Long userId,
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        logger.info("Checking access for user {} to stats of user {}", user.getId(), userId);
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to training stats");
        }
        return ResponseEntity.ok(progressService.getTrainingStats(userId, startDate, endDate));
    }    
}
