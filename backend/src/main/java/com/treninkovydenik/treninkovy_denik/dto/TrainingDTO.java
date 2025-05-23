package com.treninkovydenik.treninkovy_denik.dto;

import java.time.LocalDateTime;
import java.util.List;


public class TrainingDTO {
    private String name;
    private LocalDateTime date;
    private String description;
    private List<ExerciseDto> exercises;

    public String getName() { return name; }
    public LocalDateTime getDate() { return date; }
    public String getDescription() { return description; }
    public List<ExerciseDto> getExercises() { return exercises; }
    public void setName(String name) { this.name = name; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public void setDescription(String description) { this.description = description; }
    public void setExercises(List<ExerciseDto> exercises) { this.exercises = exercises; }

}
