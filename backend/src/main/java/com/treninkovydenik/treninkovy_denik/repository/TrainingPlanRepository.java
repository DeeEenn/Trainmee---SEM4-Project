package com.treninkovydenik.treninkovy_denik.repository;

import com.treninkovydenik.treninkovy_denik.model.TrainingPlan;
import com.treninkovydenik.treninkovy_denik.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainingPlanRepository extends JpaRepository<TrainingPlan, Long> {
    List<TrainingPlan> findByTrainer(User trainer);
    List<TrainingPlan> findByUser(User user);
    List<TrainingPlan> findByUserAndAcceptedFalse(User user);
} 