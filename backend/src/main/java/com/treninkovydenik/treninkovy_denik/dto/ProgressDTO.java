package com.treninkovydenik.treninkovy_denik.dto;

import java.time.LocalDateTime;

public class ProgressDTO {
    private Long id;
    private LocalDateTime date;
    private Double weight;
    private Double bodyFatPercentage;
    private String notes;
    private Long userId;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public LocalDateTime getDate() { return date; }
    public void setDate(LocalDateTime date) { this.date = date; }
    public Double getWeight() { return weight; }
    public void setWeight(Double weight) { this.weight = weight; }
    public Double getBodyFatPercentage() { return bodyFatPercentage; }
    public void setBodyFatPercentage(Double bodyFatPercentage) { this.bodyFatPercentage = bodyFatPercentage; }
    public String getNotes() { return notes; }
    public void setNotes(String notes) { this.notes = notes; }
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
}
