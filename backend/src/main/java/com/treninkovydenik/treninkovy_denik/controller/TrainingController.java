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
import com.treninkovydenik.treninkovy_denik.model.Exercise;
import com.treninkovydenik.treninkovy_denik.dto.ExerciseDto;
import com.treninkovydenik.treninkovy_denik.dto.ExerciseResponseDto;
import com.treninkovydenik.treninkovy_denik.dto.TrainingResponseDto;
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
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping
    public ResponseEntity<TrainingResponseDto> createTraining(@RequestBody TrainingDTO trainingDTO, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        TrainingResponseDto training = trainingService.createTraining(trainingDTO, user);
        return ResponseEntity.ok(training);
    }

    @PostMapping("/{trainingId}/exercises")
    public ResponseEntity<ExerciseResponseDto> addExercise(
            @PathVariable Long trainingId,
            @RequestBody ExerciseDto exerciseDto,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        ExerciseResponseDto exercise = trainingService.addExerciseToTraining(trainingId, exerciseDto, user);
        return ResponseEntity.ok(exercise);
    }

    @GetMapping("/{trainingId}/exercises")
    public ResponseEntity<List<ExerciseResponseDto>> getExercises(
            @PathVariable Long trainingId,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        List<ExerciseResponseDto> exercises = trainingService.getExercisesForTraining(trainingId, user);
        return ResponseEntity.ok(exercises);
    }

    @GetMapping
    public ResponseEntity<List<TrainingResponseDto>> getUserTrainings(Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        List<TrainingResponseDto> trainings = trainingService.getUserTrainings(user);
        return ResponseEntity.ok(trainings);
    }

    @GetMapping("/{id}")
    public ResponseEntity<TrainingResponseDto> getTraining(@PathVariable Long id, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        TrainingResponseDto training = trainingService.getTrainingById(id, user);
        return ResponseEntity.ok(training);
    }

    @PutMapping("/{id}")
    public ResponseEntity<TrainingResponseDto> updateTraining(
            @PathVariable Long id,
            @RequestBody TrainingDTO trainingDTO,
            Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        TrainingResponseDto training = trainingService.updateTraining(id, trainingDTO, user);
        return ResponseEntity.ok(training);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTraining(@PathVariable Long id, Authentication authentication) {
        User user = getUserFromAuthentication(authentication);
        trainingService.deleteTraining(id, user);
        return ResponseEntity.ok().build();
    }
}