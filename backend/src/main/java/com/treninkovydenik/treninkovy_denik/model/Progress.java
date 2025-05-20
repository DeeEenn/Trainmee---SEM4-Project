package com.treninkovydenik.treninkovy_denik.model;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.math.BigDecimal;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@Entity
@Table(name = "user_measurements")
public class Progress {
    private static final Logger logger = LoggerFactory.getLogger(Progress.class);

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private LocalDate date;
    private double weight;
    private double bodyFatPercentage;
    private String notes;

    public Long getId(){ return id; }
    public User getUser(){ return user; }
    public LocalDate getDate(){ return date; }
    public double getWeight(){ return weight; }
    public double getBodyFatPercentage(){ return bodyFatPercentage; }
    public String getNotes(){ return notes; }
    public void setId(Long id){ this.id = id; }
    public void setUser(User user){ this.user = user; }
    public void setDate(LocalDate date){ this.date = date; }
    public void setWeight(double weight){ this.weight = weight; }
    public void setBodyFatPercentage(double bodyFatPercentage){ this.bodyFatPercentage = bodyFatPercentage; }
    public void setNotes(String notes){ this.notes = notes; }
}
