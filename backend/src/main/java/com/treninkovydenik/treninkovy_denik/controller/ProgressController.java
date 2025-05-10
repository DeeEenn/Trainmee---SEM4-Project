package com.treninkovydenik.treninkovy_denik.controller;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import com.treninkovydenik.treninkovy_denik.service.ProgressService;
import com.treninkovydenik.treninkovy_denik.dto.ProgressDTO;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.http.ResponseEntity;
import java.util.Map;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.service.UserService;

@RestController
@RequestMapping("/api/progress")
public class ProgressController {
    private final ProgressService progressService;
    private final UserService userService;

    public ProgressController(ProgressService progressService, UserService userService){
        this.progressService = progressService;
        this.userService = userService;
    }

    private User getUserFromAuthentication(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
    }
  
    @PostMapping
    public ResponseEntity<ProgressDTO> createProgress(@RequestBody ProgressDTO progressDTO, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        progressDTO.setUserId(user.getId());
        return ResponseEntity.ok(progressService.createProgress(progressDTO));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<ProgressDTO>> getProgressByUserId(@PathVariable Long userId, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to progress data");
        }
        return ResponseEntity.ok(progressService.getProgressByUserId(userId));
    }

    @GetMapping("/user/{userId}/range")
    public ResponseEntity<List<ProgressDTO>> getProgressByDateRange(
            @PathVariable Long userId,
            @RequestParam LocalDateTime startDate,
            @RequestParam LocalDateTime endDate,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to progress data");
        }
        return ResponseEntity.ok(progressService.getProgressByDateRange(userId, startDate, endDate));
    }

    @GetMapping("/user/{userId}/training-stats")
    public ResponseEntity<Map<String, Integer>> getTrainingStatsByMonth(
            @PathVariable Long userId,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Integer month,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        if (!user.getId().equals(userId)) {
            throw new RuntimeException("Unauthorized access to progress data");
        }
        return ResponseEntity.ok(progressService.getTrainingStatsByMonth(userId, year, month));
    }
}
