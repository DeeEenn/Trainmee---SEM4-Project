package com.treninkovydenik.treninkovy_denik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.treninkovydenik.treninkovy_denik.model.Progress;
import com.treninkovydenik.treninkovy_denik.model.User;
import java.time.LocalDate;
import java.util.List;

public interface ProgressRepository extends JpaRepository<Progress, Long> {
    List<Progress> findByUserIdOrderByDateDesc(Long userId);
    List<Progress> findByUserIdAndDateBetweenOrderByDateDesc(Long userId, LocalDate startDate, LocalDate endDate);
    List<Progress> findByUserIdAndDateBetween(Long userId, LocalDate startDate, LocalDate endDate);
    boolean existsByUserAndDate(User user, LocalDate date);
}
