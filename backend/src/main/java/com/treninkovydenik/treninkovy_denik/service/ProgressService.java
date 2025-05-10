package com.treninkovydenik.treninkovy_denik.service;

import org.springframework.stereotype.Service;

import com.treninkovydenik.treninkovy_denik.repository.ProgressRepository;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.dto.ProgressDTO;
import jakarta.transaction.Transactional;
import java.time.LocalDateTime;
import com.treninkovydenik.treninkovy_denik.model.Progress;
import com.treninkovydenik.treninkovy_denik.model.User;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class ProgressService {
    private final ProgressRepository progressRepository;
    private final UserRepository userRepository;

    public ProgressService(ProgressRepository progressRepository, UserRepository userRepository){
        this.progressRepository = progressRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProgressDTO createProgress(ProgressDTO progressDTO) {
        User user = userRepository.findById(progressDTO.getUserId())
            .orElseThrow(() -> new RuntimeException("User not found"));

        Progress progress = new Progress();
        progress.setDate(LocalDateTime.now());
        progress.setWeight(progressDTO.getWeight());
        progress.setBodyFatPercentage(progressDTO.getBodyFatPercentage());
        progress.setNotes(progressDTO.getNotes());
        progress.setUser(user);

        Progress savedProgress = progressRepository.save(progress);
        return convertToDTO(savedProgress);
    }
    public List<ProgressDTO> getProgressByUserId(Long userId) {
        return progressRepository.findByUserIdOrderByDateDesc(userId)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    public List<ProgressDTO> getProgressByDateRange(Long userId, LocalDateTime startDate, LocalDateTime endDate) {
        return progressRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate)
            .stream()
            .map(this::convertToDTO)
            .collect(Collectors.toList());
    }

    private ProgressDTO convertToDTO(Progress progress) {
        ProgressDTO dto = new ProgressDTO();
        dto.setId(progress.getId());
        dto.setDate(progress.getDate());
        dto.setWeight(progress.getWeight());
        dto.setBodyFatPercentage(progress.getBodyFatPercentage());
        dto.setNotes(progress.getNotes());
        dto.setUserId(progress.getUser().getId());
        return dto;
    }

    public Map<String, Integer> getTrainingStatsByMonth(Long userId, Integer year, Integer month) {
        LocalDateTime startDate = LocalDateTime.now()
            .withYear(year != null ? year : LocalDateTime.now().getYear())
            .withMonth(month != null ? month : LocalDateTime.now().getMonthValue())
            .withDayOfMonth(1)
            .withHour(0)
            .withMinute(0)
            .withSecond(0);
        
        LocalDateTime endDate = startDate.plusMonths(1);
        
        return progressRepository.findByUserIdAndDateBetweenOrderByDateDesc(userId, startDate, endDate)
            .stream()
            .collect(Collectors.groupingBy(
                p -> p.getDate().toLocalDate().toString(),
                Collectors.collectingAndThen(Collectors.counting(), Long::intValue)
            ));
}
}