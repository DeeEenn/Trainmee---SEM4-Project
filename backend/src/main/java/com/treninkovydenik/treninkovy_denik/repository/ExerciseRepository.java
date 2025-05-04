package com.treninkovydenik.treninkovy_denik.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import com.treninkovydenik.treninkovy_denik.model.Exercise;
import com.treninkovydenik.treninkovy_denik.model.Training;
import java.util.List;

public interface ExerciseRepository extends JpaRepository<Exercise, Long> {
    List<Exercise> findByTraining(Training training);
} 