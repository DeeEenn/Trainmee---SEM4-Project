package com.treninkovydenik.treninkovy_denik.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
import java.util.Date;

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

    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);

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

    public String login(LoginRequest request) {
        User user = userRepository.findByEmail(request.email)
            .filter(u -> passwordEncoder.matches(request.password, u.getPassword()))
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));

        return Jwts.builder()
            .setSubject(user.getEmail())
            .setIssuedAt(new Date())
            .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24 hodin
            .signWith(key)
            .compact();
    }
}
