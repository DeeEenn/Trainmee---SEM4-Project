package com.treninkovydenik.treninkovy_denik.dto;

import java.time.LocalDateTime;

public class TrainingDTO {
    private String name;
    private LocalDateTime date;
    private String description;

    public String getName() {
        return name;
    }

    public LocalDateTime getDate() {
        return date;
    }
    
    public String getDescription() {
        return description;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setDate(LocalDateTime date) {
        this.date = date;
    }

    public void setDescription(String description) {
        this.description = description;
    }
}
