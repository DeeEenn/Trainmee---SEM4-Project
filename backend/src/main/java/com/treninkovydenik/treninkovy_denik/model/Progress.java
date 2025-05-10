package com.treninkovydenik.treninkovy_denik.model;

import java.time.LocalDateTime;
import jakarta.persistence.*;

@Entity
@Table(name = "progress")
public class Progress {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private LocalDateTime date;
   
    @Column(nullable = false)
    private Double weight;

    @Column(nullable = false)
    private Double bodyFatPercentage;

    @Column
    private String notes;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    public Long getId(){
        return id;
    }

    public void setId(Long id){
        this.id = id;
    }

    public LocalDateTime getDate(){
        return date;
    }

    public void setDate(LocalDateTime date){
        this.date = date;   
    }

    public Double getWeight(){
        return weight;
    }
    
    public void setWeight(Double weight){
        this.weight = weight;
    }

    public Double getBodyFatPercentage(){
        return bodyFatPercentage;
    }

    public void setBodyFatPercentage(Double bodyFatPercentage){
        this.bodyFatPercentage = bodyFatPercentage;
    }

    public String getNotes(){
        return notes;
    }

    public void setNotes(String notes){
        this.notes = notes;
    }

    public User getUser(){
        return user;
    }

    public void setUser(User user){
        this.user = user;
    }
}
