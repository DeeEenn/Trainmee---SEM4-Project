package com.treninkovydenik.treninkovy_denik.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.dto.RegisterRequest;
import com.treninkovydenik.treninkovy_denik.dto.LoginRequest;
import com.treninkovydenik.treninkovy_denik.config.JwtTokenProvider;
import java.util.HashMap;
import java.util.Map;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtTokenProvider jwtTokenProvider;

    public Map<String, Object> register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("Email already in use");
        }

        User user = new User();
        user.setName(request.name);
        user.setSurname(request.surname);
        user.setEmail(request.email);
        user.setPassword(passwordEncoder.encode(request.password));
        
        String role = (request.role != null) ? request.role.toUpperCase() : "USER";
        user.setRole(role);

        user = userRepository.save(user);

        // Vytvoření autentizace a tokenu
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(request.email, request.password)
        );
        
        String token = jwtTokenProvider.createToken(authentication);
        
        Map<String, Object> response = new HashMap<>();
        response.put("token", token);
        response.put("userId", user.getId());
        
        return response;
    }

    public Map<String, Object> login(LoginRequest request) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email, request.password)
            );
            
            User user = userRepository.findByEmail(request.email)
                .orElseThrow(() -> new RuntimeException("User not found"));
            
            String token = jwtTokenProvider.createToken(authentication);
            
            Map<String, Object> response = new HashMap<>();
            response.put("token", token);
            response.put("userId", user.getId());
            response.put("role", user.getRole());
            
            return response;
        } catch (Exception e) {
            throw new RuntimeException("Invalid credentials");
        }
    }
}
