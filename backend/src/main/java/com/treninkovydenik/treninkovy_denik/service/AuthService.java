package com.treninkovydenik.treninkovy_denik.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.dto.RegisterRequest;
import com.treninkovydenik.treninkovy_denik.dto.LoginRequest;

@Service
public class AuthService {
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("User already exists");
        }

        User user = new User();
        user.setName(request.name);
        user.setSurname(request.surname);
        user.setEmail(request.email);
        user.setPassword(passwordEncoder.encode(request.password));
        user.setRole("USER");
        userRepository.save(user);
    }

    public User login(LoginRequest request) {
        return userRepository.findByEmail(request.email)
        .filter(u -> passwordEncoder.matches(request.password, u.getPassword()))
        .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
}
