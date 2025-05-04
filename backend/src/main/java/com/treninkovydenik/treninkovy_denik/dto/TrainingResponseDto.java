package com.treninkovydenik.treninkovy_denik.dto;

import java.time.LocalDateTime;
import java.util.List;

public class TrainingResponseDto {
    private Long id;
    private String name;
    private LocalDateTime date;
    private String description;
    private List<ExerciseResponseDto> exercises;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public LocalDateTime getDate() {
        return date;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public List<ExerciseResponseDto> getExercises() {
        return exercises;
    }

    public void setExercises(List<ExerciseResponseDto> exercises) {
        this.exercises = exercises;
    }
} 