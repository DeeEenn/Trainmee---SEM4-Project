package com.treninkovydenik.treninkovy_denik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import com.treninkovydenik.treninkovy_denik.model.Progress;
import java.time.LocalDateTime;

public interface ProgressReporsitory extends JpaRepository<Progress, Long> {
    List<Progress> findByUserId(Long userId);
    List<Progress> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDateTime startDate, LocalDateTime endDate);
    List<Progress> findByUserIdOrderByDateDesc(Long userId);
}