package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.dto.RegisterRequest;
import com.treninkovydenik.treninkovy_denik.dto.LoginRequest;
import com.treninkovydenik.treninkovy_denik.config.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class AuthServiceTest {

    @Mock
    private UserRepository userRepository;
    
    @Mock
    private PasswordEncoder passwordEncoder;
    
    @Mock
    private AuthenticationManager authenticationManager;
    
    @Mock
    private JwtTokenProvider jwtTokenProvider;
    
    @Mock
    private Authentication authentication;

    private AuthService authService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        authService = new AuthService(userRepository, passwordEncoder, authenticationManager, jwtTokenProvider);
    }

    @Test
    void register_NewUser_Success() {
        RegisterRequest request = new RegisterRequest();
        request.setName("Test");
        request.setSurname("User");
        request.setEmail("test@example.com");
        request.setPassword("password123");
        request.setRole("USER");

        User savedUser = new User();
        savedUser.setId(1L);
        savedUser.setName(request.getName());
        savedUser.setSurname(request.getSurname());
        savedUser.setEmail(request.getEmail());
        savedUser.setRole(request.getRole());

        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.empty());
        when(passwordEncoder.encode(any())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(savedUser);
        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(jwtTokenProvider.createToken(any())).thenReturn("jwtToken");

        Map<String, Object> response = authService.register(request);

        assertNotNull(response);
        assertEquals("jwtToken", response.get("token"));
        assertEquals(1L, response.get("userId"));
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_ExistingEmail_ThrowsException() {
        RegisterRequest request = new RegisterRequest();
        request.setEmail("existing@example.com");
        
        User existingUser = new User();
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(existingUser));

        assertThrows(RuntimeException.class, () -> authService.register(request));
    }

    @Test
    void login_ValidCredentials_Success() {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("password123");

        User user = new User();
        user.setId(1L);
        user.setEmail(request.getEmail());
        user.setRole("USER");

        when(authenticationManager.authenticate(any())).thenReturn(authentication);
        when(userRepository.findByEmail(request.getEmail())).thenReturn(Optional.of(user));
        when(jwtTokenProvider.createToken(any())).thenReturn("jwtToken");

        Map<String, Object> response = authService.login(request);

        assertNotNull(response);
        assertEquals("jwtToken", response.get("token"));
        assertEquals(1L, response.get("userId"));
        assertEquals("USER", response.get("role"));
    }

    @Test
    void login_InvalidCredentials_ThrowsException() {
        LoginRequest request = new LoginRequest();
        request.setEmail("test@example.com");
        request.setPassword("wrongpassword");

        when(authenticationManager.authenticate(any()))
            .thenThrow(new RuntimeException("Invalid credentials"));

        assertThrows(RuntimeException.class, () -> authService.login(request));
    }
} 