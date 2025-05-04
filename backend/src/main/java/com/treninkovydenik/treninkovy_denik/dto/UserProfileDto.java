package com.treninkovydenik.treninkovy_denik.dto;

import lombok.Data;

@Data
public class UserProfileDto {
    private String name;
    private String surname;
    private String email;

    public UserProfileDto(String name, String surname, String email) {
        this.name = name;
        this.surname = surname;
        this.email = email;
    }
} 