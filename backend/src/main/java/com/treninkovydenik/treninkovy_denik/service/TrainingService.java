package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.dto.TrainingDTO;
import com.treninkovydenik.treninkovy_denik.model.Training;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.TrainingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.treninkovydenik.treninkovy_denik.dto.ExerciseDto;
import com.treninkovydenik.treninkovy_denik.model.Exercise;
import com.treninkovydenik.treninkovy_denik.repository.ExerciseRepository;
import java.util.List;
import com.treninkovydenik.treninkovy_denik.dto.ExerciseResponseDto;
import java.util.stream.Collectors;
import java.util.ArrayList;
import com.treninkovydenik.treninkovy_denik.dto.TrainingResponseDto;

@Service
public class TrainingService {
    private final TrainingRepository trainingRepository;
    private final ExerciseRepository exerciseRepository;

    public TrainingService(TrainingRepository trainingRepository, ExerciseRepository exerciseRepository) {
        this.trainingRepository = trainingRepository;
        this.exerciseRepository = exerciseRepository;
    }

    @Transactional
    public TrainingResponseDto createTraining(TrainingDTO trainingDTO, User user) {
        Training training = new Training();
        training.setName(trainingDTO.getName());
        training.setDate(trainingDTO.getDate());
        training.setDescription(trainingDTO.getDescription());
        training.setUser(user);
        Training savedTraining = trainingRepository.save(training);
        
        TrainingResponseDto responseDto = new TrainingResponseDto();
        responseDto.setId(savedTraining.getId());
        responseDto.setName(savedTraining.getName());
        responseDto.setDate(savedTraining.getDate());
        responseDto.setDescription(savedTraining.getDescription());
        responseDto.setExercises(new ArrayList<>());
        
        return responseDto;
    }

    private Training getTrainingEntityById(Long id, User user) {
        return trainingRepository.findById(id)
            .filter(t -> t.getUser().getId().equals(user.getId()))
            .orElseThrow(() -> new RuntimeException("Training not found or unauthorized"));
    }

    public TrainingResponseDto getTrainingById(Long id, User user) {
        Training training = getTrainingEntityById(id, user);
        TrainingResponseDto dto = new TrainingResponseDto();
        dto.setId(training.getId());
        dto.setName(training.getName());
        dto.setDate(training.getDate());
        dto.setDescription(training.getDescription());
        dto.setExercises(training.getExercises().stream().map(exercise -> {
            ExerciseResponseDto exerciseDto = new ExerciseResponseDto();
            exerciseDto.setId(exercise.getId());
            exerciseDto.setName(exercise.getName());
            exerciseDto.setDescription(exercise.getDescription());
            exerciseDto.setBodyPart(exercise.getBodyPart());
            exerciseDto.setSets(exercise.getSets());
            exerciseDto.setReps(exercise.getReps());
            return exerciseDto;
        }).collect(Collectors.toList()));
        
        return dto;
    }

    @Transactional
    public ExerciseResponseDto addExerciseToTraining(Long trainingId, ExerciseDto exerciseDto, User user) {
        Training training = getTrainingEntityById(trainingId, user);
        
        Exercise exercise = new Exercise();
        exercise.setName(exerciseDto.getName());
        exercise.setDescription(exerciseDto.getDescription());
        exercise.setBodyPart(exerciseDto.getBodyPart());
        exercise.setSets(exerciseDto.getSets());
        exercise.setReps(exerciseDto.getReps());
        exercise.setTraining(training);
        
        Exercise savedExercise = exerciseRepository.save(exercise);
        
        ExerciseResponseDto responseDto = new ExerciseResponseDto();
        responseDto.setId(savedExercise.getId());
        responseDto.setName(savedExercise.getName());
        responseDto.setDescription(savedExercise.getDescription());
        responseDto.setBodyPart(savedExercise.getBodyPart());
        responseDto.setSets(savedExercise.getSets());
        responseDto.setReps(savedExercise.getReps());
        
        return responseDto;
    }

    public List<ExerciseResponseDto> getExercisesForTraining(Long trainingId, User user) {
        Training training = getTrainingEntityById(trainingId, user);
        List<Exercise> exercises = exerciseRepository.findByTraining(training);
        
        return exercises.stream().map(exercise -> {
            ExerciseResponseDto dto = new ExerciseResponseDto();
            dto.setId(exercise.getId());
            dto.setName(exercise.getName());
            dto.setDescription(exercise.getDescription());
            dto.setBodyPart(exercise.getBodyPart());
            dto.setSets(exercise.getSets());
            dto.setReps(exercise.getReps());
            return dto;
        }).collect(Collectors.toList());
    }

    public List<TrainingResponseDto> getUserTrainings(User user) {
        List<Training> trainings = trainingRepository.findByUserId(user.getId());
        return trainings.stream().map(training -> {
            TrainingResponseDto dto = new TrainingResponseDto();
            dto.setId(training.getId());
            dto.setName(training.getName());
            dto.setDate(training.getDate());
            dto.setDescription(training.getDescription());
            dto.setExercises(training.getExercises().stream().map(exercise -> {
                ExerciseResponseDto exerciseDto = new ExerciseResponseDto();
                exerciseDto.setId(exercise.getId());
                exerciseDto.setName(exercise.getName());
                exerciseDto.setDescription(exercise.getDescription());
                exerciseDto.setBodyPart(exercise.getBodyPart());
                exerciseDto.setSets(exercise.getSets());
                exerciseDto.setReps(exercise.getReps());
                return exerciseDto;
            }).collect(Collectors.toList()));
            return dto;
        }).collect(Collectors.toList());
    }

    @Transactional
    public TrainingResponseDto updateTraining(Long id, TrainingDTO trainingDTO, User user) {
        Training training = trainingRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Training not found"));
        
        if (!training.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        training.setName(trainingDTO.getName());
        training.setDate(trainingDTO.getDate());
        training.setDescription(trainingDTO.getDescription());
        Training updatedTraining = trainingRepository.save(training);
        
        TrainingResponseDto responseDto = new TrainingResponseDto();
        responseDto.setId(updatedTraining.getId());
        responseDto.setName(updatedTraining.getName());
        responseDto.setDate(updatedTraining.getDate());
        responseDto.setDescription(updatedTraining.getDescription());
        responseDto.setExercises(updatedTraining.getExercises().stream().map(exercise -> {
            ExerciseResponseDto exerciseDto = new ExerciseResponseDto();
            exerciseDto.setId(exercise.getId());
            exerciseDto.setName(exercise.getName());
            exerciseDto.setDescription(exercise.getDescription());
            exerciseDto.setBodyPart(exercise.getBodyPart());
            exerciseDto.setSets(exercise.getSets());
            exerciseDto.setReps(exercise.getReps());
            return exerciseDto;
        }).collect(Collectors.toList()));
        
        return responseDto;
    }

    @Transactional
    public void deleteTraining(Long id, User user) {
        if (!trainingRepository.existsByIdAndUser(id, user)) {
            throw new RuntimeException("Training not found or unauthorized");
        }
        trainingRepository.deleteById(id);
    }
}