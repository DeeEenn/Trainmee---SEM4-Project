package com.treninkovydenik.treninkovy_denik.dto;

import lombok.Data;

@Data
public class UserProfileDto {
    private Long id;
    private String name;
    private String surname;
    private String email;
    private Double bodyFatPercentage;
    private Double weight;
    private Double height;
    private String profilePictureUrl;
    private String description;

    public UserProfileDto(Long id, String name, String surname, String email, Double bodyFatPercentage, Double weight, Double height, String profilePictureUrl, String description) {
        this.id = id;
        this.name = name;
        this.surname = surname;
        this.email = email;
        this.bodyFatPercentage = bodyFatPercentage;
        this.weight = weight;
        this.height = height;
        this.profilePictureUrl = profilePictureUrl;
        this.description = description;
    }

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getSurname() { return surname; }
    public String getEmail() { return email; }
    public Double getBodyFatPercentage() { return bodyFatPercentage; }
    public Double getWeight() { return weight; }
    public Double getHeight() { return height; }
    public String getProfilePictureUrl() { return profilePictureUrl; }
    public String getDescription() { return description; }
    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setSurname(String surname) { this.surname = surname; }
    public void setEmail(String email) { this.email = email; }
    public void setBodyFatPercentage(Double bodyFatPercentage) { this.bodyFatPercentage = bodyFatPercentage; }
    public void setWeight(Double weight) { this.weight = weight; }
    public void setHeight(Double height) { this.height = height; }
    public void setProfilePictureUrl(String profilePictureUrl) { this.profilePictureUrl = profilePictureUrl; }
    public void setDescription(String description) { this.description = description; }
} 