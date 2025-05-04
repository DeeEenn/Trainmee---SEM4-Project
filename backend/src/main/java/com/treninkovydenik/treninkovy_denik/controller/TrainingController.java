package com.treninkovydenik.treninkovy_denik.controller;

import com.treninkovydenik.treninkovy_denik.dto.TrainingDTO;
import com.treninkovydenik.treninkovy_denik.model.Training;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.service.TrainingService;
import com.treninkovydenik.treninkovy_denik.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/trainings")
public class TrainingController {
    private final TrainingService trainingService;
    private final UserService userService;

    public TrainingController(TrainingService trainingService, UserService userService) {
        this.trainingService = trainingService;
        this.userService = userService;
    }

    private User getUserFromAuthentication(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return userService.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
    }

    @PostMapping
    public ResponseEntity<Training> createTraining(@RequestBody TrainingDTO trainingDTO, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        Training training = trainingService.createTraining(trainingDTO, user);
        return ResponseEntity.ok(training);
    }

    @GetMapping
    public ResponseEntity<List<Training>> getUserTrainings(Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        List<Training> trainings = trainingService.getUserTrainings(user);
        return ResponseEntity.ok(trainings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Training> getTraining(@PathVariable Long id, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        Training training = trainingService.getTrainingById(id, user);
        return ResponseEntity.ok(training);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Training> updateTraining(
            @PathVariable Long id,
            @RequestBody TrainingDTO trainingDTO,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        Training training = trainingService.updateTraining(id, trainingDTO, user);
        return ResponseEntity.ok(training);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        trainingService.deleteTraining(id, user);
        return ResponseEntity.ok().build();
    }
}