package com.treninkovydenik.treninkovy_denik.model;

import jakarta.persistence.*;

@Entity
@Table(name = "exercises")
public class Exercise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column
    private String description;

    @Column(nullable = false)
    private String bodyPart;

    @Column
    private Integer sets;

    @Column
    private Integer reps;

    @ManyToOne
    @JoinColumn(name = "training_id", nullable = false)
    private Training training;

    public Long getId() {
        return id;
    }

    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public String getDescription() { return description; }
    public String getBodyPart() { return bodyPart; }
    public Integer getSets() { return sets; }
    public Integer getReps() { return reps; }
    public Training getTraining() { return training; }
    public void setName(String name) { this.name = name; }
    public void setDescription(String description) { this.description = description; }
    public void setBodyPart(String bodyPart) { this.bodyPart = bodyPart; }
    public void setSets(Integer sets) { this.sets = sets; }
    public void setReps(Integer reps) { this.reps = reps; }
    public void setTraining(Training training) { this.training = training; }
}
