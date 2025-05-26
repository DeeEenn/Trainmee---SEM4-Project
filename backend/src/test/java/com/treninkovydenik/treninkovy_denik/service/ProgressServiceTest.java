package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.model.Progress;
import com.treninkovydenik.treninkovy_denik.repository.ProgressRepository;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.dto.ProgressDTO;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.util.Optional;
import java.util.List;
import java.util.ArrayList;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class ProgressServiceTest {

    @Mock
    private ProgressRepository progressRepository;

    @Mock
    private UserRepository userRepository;

    private ProgressService progressService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        progressService = new ProgressService(progressRepository, userRepository);
    }

    @Test
    void createProgress_Success() { 
        ProgressDTO progressDTO = new ProgressDTO();
        progressDTO.setUserId(1L);
        progressDTO.setWeight(80.5);
        progressDTO.setDate(LocalDate.now());
        progressDTO.setBodyFatPercentage(15.0);
        progressDTO.setNotes("Test progress");

        User user = new User();
        user.setId(1L);

        Progress savedProgress = new Progress();
        savedProgress.setId(1L);
        savedProgress.setUser(user);
        savedProgress.setWeight(progressDTO.getWeight());
        savedProgress.setDate(progressDTO.getDate());
        savedProgress.setBodyFatPercentage(progressDTO.getBodyFatPercentage());
        savedProgress.setNotes(progressDTO.getNotes());

        when(userRepository.findById(progressDTO.getUserId())).thenReturn(Optional.of(user));
        when(progressRepository.save(any(Progress.class))).thenReturn(savedProgress);

        ProgressDTO result = progressService.createProgress(progressDTO);

        assertNotNull(result);
        assertEquals(progressDTO.getWeight(), result.getWeight());
        assertEquals(progressDTO.getDate(), result.getDate());
        assertEquals(progressDTO.getBodyFatPercentage(), result.getBodyFatPercentage());
        assertEquals(progressDTO.getNotes(), result.getNotes());
        verify(progressRepository).save(any(Progress.class));
    }

    @Test
    void getUserMeasurements_ReturnsMeasurements() {
        Long userId = 1L;
        LocalDate startDate = LocalDate.now().minusMonths(1);
        LocalDate endDate = LocalDate.now();

        User user = new User();
        user.setId(userId);

        List<Progress> measurements = new ArrayList<>();
        Progress progress = new Progress();
        progress.setId(1L);
        progress.setUser(user);
        measurements.add(progress);

        when(progressRepository.findByUserIdAndDateBetween(userId, startDate, endDate))
            .thenReturn(measurements);

        List<ProgressDTO> result = progressService.getUserMeasurements(userId, startDate, endDate);

        assertNotNull(result);
        assertEquals(measurements.size(), result.size());
        verify(progressRepository).findByUserIdAndDateBetween(userId, startDate, endDate);
    }

    @Test
    void getTrainingStats_ReturnsStats() {
        Long userId = 1L;
        LocalDate startDate = LocalDate.now().minusMonths(1);
        LocalDate endDate = LocalDate.now();

        List<Progress> measurements = new ArrayList<>();
        Progress progress1 = new Progress();
        progress1.setWeight(80.0);
        progress1.setBodyFatPercentage(15.0);
        measurements.add(progress1);

        Progress progress2 = new Progress();
        progress2.setWeight(79.0);
        progress2.setBodyFatPercentage(14.5);
        measurements.add(progress2);

        when(progressRepository.findByUserIdAndDateBetween(userId, startDate, endDate))
            .thenReturn(measurements);

        Map<String, Object> result = progressService.getTrainingStats(userId, startDate, endDate);

        assertNotNull(result);
        assertEquals(79.5, (double)result.get("averageWeight"));
        assertEquals(14.75, (double)result.get("averageBodyFat"));
        assertEquals(2, result.get("measurementCount"));
        verify(progressRepository).findByUserIdAndDateBetween(userId, startDate, endDate);
    }
} 