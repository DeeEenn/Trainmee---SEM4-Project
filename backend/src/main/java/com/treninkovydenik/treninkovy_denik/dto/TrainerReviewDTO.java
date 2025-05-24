package com.treninkovydenik.treninkovy_denik.dto;

public class TrainerReviewDTO {
    private Long id;
    private Long trainerId;
    private Long userId;
    private Integer rating;
    private String comment;
    private String createdAt;
    private String trainerName;
    private String userName;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTrainerId() { return trainerId; }
    public void setTrainerId(Long trainerId) { this.trainerId = trainerId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }
} 