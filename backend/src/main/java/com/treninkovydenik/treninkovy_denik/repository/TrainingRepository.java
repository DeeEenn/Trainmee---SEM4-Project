package com.treninkovydenik.treninkovy_denik.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import com.treninkovydenik.treninkovy_denik.model.Training;
import com.treninkovydenik.treninkovy_denik.model.User;

public interface TrainingRepository extends JpaRepository<Training, Long> {
    List<Training> findByUserId(Long userId);
    boolean existsByIdAndUser(Long id, User user);
}
