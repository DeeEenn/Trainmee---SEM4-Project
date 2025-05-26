package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.model.Training;
import com.treninkovydenik.treninkovy_denik.model.Exercise;
import com.treninkovydenik.treninkovy_denik.repository.TrainingRepository;
import com.treninkovydenik.treninkovy_denik.repository.ExerciseRepository;
import com.treninkovydenik.treninkovy_denik.dto.TrainingDTO;
import com.treninkovydenik.treninkovy_denik.dto.ExerciseDto;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class TrainingServiceTest {

    @Mock
    private TrainingRepository trainingRepository;

    @Mock
    private ExerciseRepository exerciseRepository;

    private TrainingService trainingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        trainingService = new TrainingService(trainingRepository, exerciseRepository);
    }

    @Test
    void createTraining_Success() {
        User user = new User();
        user.setId(1L);

        TrainingDTO trainingDTO = new TrainingDTO();
        trainingDTO.setName("Test Training");
        trainingDTO.setDate(LocalDateTime.now());
        trainingDTO.setDescription("Test Description");

        Training savedTraining = new Training();
        savedTraining.setId(1L);
        savedTraining.setName(trainingDTO.getName());
        savedTraining.setDate(trainingDTO.getDate());
        savedTraining.setDescription(trainingDTO.getDescription());
        savedTraining.setUser(user);

        when(trainingRepository.save(any(Training.class))).thenReturn(savedTraining);

        var result = trainingService.createTraining(trainingDTO, user);

        assertNotNull(result);
        assertEquals(trainingDTO.getName(), result.getName());
        assertEquals(trainingDTO.getDate(), result.getDate());
        assertEquals(trainingDTO.getDescription(), result.getDescription());
        verify(trainingRepository).save(any(Training.class));
    }

    @Test
    void getTrainingById_ExistingTraining_ReturnsTraining() {
        Long trainingId = 1L;
        User user = new User();
        user.setId(1L);

        Training training = new Training();
        training.setId(trainingId);
        training.setUser(user);

        when(trainingRepository.findById(trainingId)).thenReturn(Optional.of(training));

        var result = trainingService.getTrainingById(trainingId, user);

        assertNotNull(result);
        assertEquals(trainingId, result.getId());
        verify(trainingRepository).findById(trainingId);
    }

    @Test
    void getTrainingById_NonExistingTraining_ThrowsException() {
        Long trainingId = 999L;
        User user = new User();
        when(trainingRepository.findById(trainingId)).thenReturn(Optional.empty());

        assertThrows(RuntimeException.class, () -> 
            trainingService.getTrainingById(trainingId, user));
    }

    @Test
    void addExerciseToTraining_Success() {
        Long trainingId = 1L;
        User user = new User();
        user.setId(1L);

        Training training = new Training();
        training.setId(trainingId);
        training.setUser(user);

        ExerciseDto exerciseDto = new ExerciseDto();
        exerciseDto.setName("Test Exercise");
        exerciseDto.setDescription("Test Description");
        exerciseDto.setBodyPart("Chest");
        exerciseDto.setSets(3);
        exerciseDto.setReps(10);

        Exercise savedExercise = new Exercise();
        savedExercise.setId(1L);
        savedExercise.setName(exerciseDto.getName());
        savedExercise.setDescription(exerciseDto.getDescription());
        savedExercise.setBodyPart(exerciseDto.getBodyPart());
        savedExercise.setSets(exerciseDto.getSets());
        savedExercise.setReps(exerciseDto.getReps());
        savedExercise.setTraining(training);

        when(trainingRepository.findById(trainingId)).thenReturn(Optional.of(training));
        when(exerciseRepository.save(any(Exercise.class))).thenReturn(savedExercise);

        var result = trainingService.addExerciseToTraining(trainingId, exerciseDto, user);

        assertNotNull(result);
        assertEquals(exerciseDto.getName(), result.getName());
        assertEquals(exerciseDto.getDescription(), result.getDescription());
        assertEquals(exerciseDto.getBodyPart(), result.getBodyPart());
        assertEquals(exerciseDto.getSets(), result.getSets());
        assertEquals(exerciseDto.getReps(), result.getReps());
        verify(exerciseRepository).save(any(Exercise.class));
    }

    @Test
    void getUserTrainings_ReturnsTrainings() {
        User user = new User();
        user.setId(1L);

        List<Training> trainings = new ArrayList<>();
        Training training = new Training();
        training.setId(1L);
        training.setUser(user);
        trainings.add(training);

        when(trainingRepository.findByUserId(user.getId())).thenReturn(trainings);

        List<?> result = trainingService.getUserTrainings(user);

        assertNotNull(result);
        assertEquals(trainings.size(), result.size());
        verify(trainingRepository).findByUserId(user.getId());
    }

    @Test
    void deleteTraining_Success() {
        Long trainingId = 1L;
        User user = new User();
        user.setId(1L);

        when(trainingRepository.existsByIdAndUser(trainingId, user)).thenReturn(true);

        trainingService.deleteTraining(trainingId, user);

        verify(trainingRepository).deleteById(trainingId);
    }

    @Test
    void deleteTraining_NonExistingTraining_ThrowsException() {
        Long trainingId = 999L;
        User user = new User();
        when(trainingRepository.existsByIdAndUser(trainingId, user)).thenReturn(false);

        assertThrows(RuntimeException.class, () -> 
            trainingService.deleteTraining(trainingId, user));
    }
} 