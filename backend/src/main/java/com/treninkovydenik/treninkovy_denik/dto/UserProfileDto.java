package com.treninkovydenik.treninkovy_denik.dto;

import lombok.Data;

@Data
public class UserProfileDto {
    private String name;
    private String surname;
    private String email;
    private Double bodyFatPercentage;
    private Double weight;
    private Double height;

    public UserProfileDto(String name, String surname, String email, Double bodyFatPercentage, Double weight, Double height) {
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.bodyFatPercentage = bodyFatPercentage;
        this.weight = weight;
        this.height = height;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSurname() {
        return surname;
    }

    public void setSurname(String surname) {
        this.surname = surname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Double getBodyFatPercentage() {
        return bodyFatPercentage;
    }

    public void setBodyFatPercentage(Double bodyFatPercentage) {
        this.bodyFatPercentage = bodyFatPercentage;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }
} 