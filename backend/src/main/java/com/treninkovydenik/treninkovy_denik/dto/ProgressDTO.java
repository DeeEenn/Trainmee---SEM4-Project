package com.treninkovydenik.treninkovy_denik.dto;

import java.time.LocalDate;

public class ProgressDTO {
    private Long id;
    private Long userId;
    private LocalDate date;
    private double weight;
    private double bodyFatPercentage;
    private String notes;

    public Long getId(){ return id; }
    public Long getUserId(){ return userId; }
    public LocalDate getDate(){ return date; }
    public double getWeight(){ return weight; }
    public double getBodyFatPercentage(){ return bodyFatPercentage; }
    public String getNotes(){ return notes; }
    public void setId(Long id){ this.id = id; }
    public void setUserId(Long userId){ this.userId = userId; }
    public void setDate(LocalDate date){ this.date = date; }
    public void setWeight(double weight){ this.weight = weight; }
    public void setBodyFatPercentage(double bodyFatPercentage){ this.bodyFatPercentage = bodyFatPercentage; }
    public void setNotes(String notes){ this.notes = notes; }
    
    
}
