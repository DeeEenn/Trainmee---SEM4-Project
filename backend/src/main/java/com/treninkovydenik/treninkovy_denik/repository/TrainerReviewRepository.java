package com.treninkovydenik.treninkovy_denik.repository;

import com.treninkovydenik.treninkovy_denik.model.TrainerReview;
import com.treninkovydenik.treninkovy_denik.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainerReviewRepository extends JpaRepository<TrainerReview, Long> {
    List<TrainerReview> findByTrainer(User trainer);
    List<TrainerReview> findByUser(User user);
    boolean existsByTrainerAndUser(User trainer, User user);
} 