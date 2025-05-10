package com.treninkovydenik.treninkovy_denik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.treninkovydenik.treninkovy_denik.model.Progress;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUserIdOrderByDateDesc(Long userId);
    List<Progress> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDateTime startDate, LocalDateTime endDate);
} 