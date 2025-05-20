package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.dto.ProgressDTO;
import com.treninkovydenik.treninkovy_denik.model.Progress;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.ProgressRepository;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProgressService {
    private static final Logger logger = LoggerFactory.getLogger(ProgressService.class);

    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    @Autowired
    public ProgressService(ProgressRepository progressRepository, UserRepository userRepository) {
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProgressDTO createProgress(ProgressDTO progressDTO) {
        logger.info("Creating progress for user: {}", progressDTO.getUserId());
        User user = userRepository.findById(progressDTO.getUserId())
                .orElseThrow(() -> new RuntimeException("User not found"));

        Progress progress = new Progress();
        progress.setUser(user);
        progress.setDate(progressDTO.getDate() != null ? progressDTO.getDate() : LocalDate.now());
        progress.setWeight(progressDTO.getWeight());
        progress.setBodyFatPercentage(progressDTO.getBodyFatPercentage());
        progress.setNotes(progressDTO.getNotes());

        Progress savedProgress = progressRepository.save(progress);
        logger.info("Created progress with id: {} for date: {}", savedProgress.getId(), savedProgress.getDate());
        return convertToDTO(savedProgress);
    }

    public List<ProgressDTO> getUserMeasurements(Long userId, LocalDate startDate, LocalDate endDate) {
        logger.info("Getting measurements for user: {} between {} and {}", userId, startDate, endDate);
        List<Progress> measurements;
        
        if (startDate != null && endDate != null) {
            measurements = progressRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        } else {
            measurements = progressRepository.findByUserIdOrderByDateDesc(userId);
        }
        
        logger.info("Found {} measurements", measurements.size());
        return measurements.stream()
                .map(this::convertToDTO)
                .collect(Collectors.toList());
    }

    public Map<String, Object> getTrainingStats(Long userId, LocalDate startDate, LocalDate endDate) {
        logger.info("Getting training stats for user: {} between {} and {}", userId, startDate, endDate);
        List<Progress> measurements;
        
        if (startDate != null && endDate != null) {
            measurements = progressRepository.findByUserIdAndDateBetween(userId, startDate, endDate);
        } else {
            measurements = progressRepository.findByUserIdOrderByDateDesc(userId);
        }
        
        logger.info("Found {} measurements for stats", measurements.size());
        
        double avgWeight = measurements.stream()
                .mapToDouble(Progress::getWeight)
                .average()
                .orElse(0.0);
                
        double avgBodyFat = measurements.stream()
                .mapToDouble(Progress::getBodyFatPercentage)
                .average()
                .orElse(0.0);

        return Map.of(
            "averageWeight", avgWeight,
            "averageBodyFat", avgBodyFat,
            "measurementCount", measurements.size()
        );
    }

    private ProgressDTO convertToDTO(Progress progress) {
        ProgressDTO dto = new ProgressDTO();
        dto.setId(progress.getId());
        dto.setUserId(progress.getUser().getId());
        dto.setDate(progress.getDate());
        dto.setWeight(progress.getWeight());
        dto.setBodyFatPercentage(progress.getBodyFatPercentage());
        dto.setNotes(progress.getNotes());
        return dto;
    }
}

