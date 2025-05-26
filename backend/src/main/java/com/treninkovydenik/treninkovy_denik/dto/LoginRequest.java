package com.treninkovydenik.treninkovy_denik.dto;
public class LoginRequest {
    public String email;
    public String password;

    public void setEmail(String email) { this.email = email; }
    public void setPassword(String password) { this.password = password; }
    public String getEmail() { return email; }
    public String getPassword() { return password; }
}
