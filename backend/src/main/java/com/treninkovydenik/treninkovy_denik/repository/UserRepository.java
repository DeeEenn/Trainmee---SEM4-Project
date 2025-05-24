package com.treninkovydenik.treninkovy_denik.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import com.treninkovydenik.treninkovy_denik.model.User;
import java.util.Optional;
import java.util.List;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmail(String email);
    List<User> findByRole(String role);
}
