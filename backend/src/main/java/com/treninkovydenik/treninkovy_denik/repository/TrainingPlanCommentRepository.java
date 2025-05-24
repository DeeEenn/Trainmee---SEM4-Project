package com.treninkovydenik.treninkovy_denik.repository;

import com.treninkovydenik.treninkovy_denik.model.TrainingPlan;
import com.treninkovydenik.treninkovy_denik.model.TrainingPlanComment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface TrainingPlanCommentRepository extends JpaRepository<TrainingPlanComment, Long> {
    List<TrainingPlanComment> findByTrainingPlan(TrainingPlan trainingPlan);
} 