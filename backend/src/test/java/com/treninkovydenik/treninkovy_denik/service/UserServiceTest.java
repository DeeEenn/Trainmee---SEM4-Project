package com.treninkovydenik.treninkovy_denik.service;

import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.repository.ProgressRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private ProgressRepository progressRepository;

    private UserService userService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userService = new UserService(userRepository, progressRepository);
    }

    @Test
    void findByEmail_ExistingUser_ReturnsUser() {
        String email = "test@example.com";
        User user = new User();
        user.setEmail(email);
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(user));

        Optional<User> result = userService.findByEmail(email);

        assertTrue(result.isPresent());
        assertEquals(email, result.get().getEmail());
        verify(userRepository).findByEmail(email);
    }

    @Test
    void findByEmail_NonExistingUser_ReturnsEmpty() {
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        Optional<User> result = userService.findByEmail(email);

        assertTrue(result.isEmpty());
        verify(userRepository).findByEmail(email);
    }

    @Test
    void findById_ExistingUser_ReturnsUser() {
        Long id = 1L;
        User user = new User();
        user.setId(id);
        when(userRepository.findById(id)).thenReturn(Optional.of(user));

        Optional<User> result = userService.findById(id);

        assertTrue(result.isPresent());
        assertEquals(id, result.get().getId());
        verify(userRepository).findById(id);
    }

    @Test
    void findById_NonExistingUser_ReturnsEmpty() {
        Long id = 999L;
        when(userRepository.findById(id)).thenReturn(Optional.empty());

        Optional<User> result = userService.findById(id);

        assertTrue(result.isEmpty());
        verify(userRepository).findById(id);
    }
} 