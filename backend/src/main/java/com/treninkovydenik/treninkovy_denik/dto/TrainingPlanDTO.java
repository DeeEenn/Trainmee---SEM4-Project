package com.treninkovydenik.treninkovy_denik.dto;

import java.util.List;

public class TrainingPlanDTO {
    private Long id;
    private Long trainerId;
    private Long userId;
    private String title;
    private String description;
    private String createdAt;
    private boolean accepted;
    private String trainerName;
    private String userName;
    private List<TrainingPlanCommentDTO> comments;

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getTrainerId() { return trainerId; }
    public void setTrainerId(Long trainerId) { this.trainerId = trainerId; }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public boolean isAccepted() { return accepted; }
    public void setAccepted(boolean accepted) { this.accepted = accepted; }

    public String getTrainerName() { return trainerName; }
    public void setTrainerName(String trainerName) { this.trainerName = trainerName; }

    public String getUserName() { return userName; }
    public void setUserName(String userName) { this.userName = userName; }

    public List<TrainingPlanCommentDTO> getComments() { return comments; }
    public void setComments(List<TrainingPlanCommentDTO> comments) { this.comments = comments; }
} 