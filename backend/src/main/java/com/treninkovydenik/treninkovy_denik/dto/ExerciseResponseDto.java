package com.treninkovydenik.treninkovy_denik.dto;

public class ExerciseResponseDto {
    private Long id;
    private String name;
    private String description;
    private String bodyPart;
    private Integer sets;
    private Integer reps;

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getBodyPart() { return bodyPart; }
    public Integer getSets() { return sets; }
    public Integer getReps() { return reps; }
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setBodyPart(String bodyPart) { this.bodyPart = bodyPart; }
    public void setSets(Integer sets) { this.sets = sets; }
    public void setReps(Integer reps) { this.reps = reps; }
} 