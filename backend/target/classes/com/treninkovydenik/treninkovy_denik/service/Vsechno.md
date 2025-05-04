package com.treninkovydenik.treninkovy_denik.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import java.util.List;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
@Configuration
@EnableWebSecurity
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        return http
            .csrf().disable()
            .authorizeHttpRequests(auth -> auth.anyRequest().permitAll())
            .build();
    }
}

package com.treninkovydenik.treninkovy_denik.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.service.AuthService;
import com.treninkovydenik.treninkovy_denik.dto.RegisterRequest;
import com.treninkovydenik.treninkovy_denik.dto.LoginRequest;
import java.util.Collections;
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody RegisterRequest request) {
        authService.register(request);
        return ResponseEntity.ok("Registered successfully");
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        User user = authService.login(request);
        return ResponseEntity.ok(user); // V praxi vracej token, ne celé uživatele
    }
}


package com.treninkovydenik.treninkovy_denik.controller;

import com.treninkovydenik.treninkovy_denik.dto.UserProfileDto;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private static final Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            logger.info("Authentication: {}", authentication);
            
            String email = authentication.getName();
            logger.info("User email from authentication: {}", email);
            
            User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Uživatel nenalezen"));
            logger.info("Found user: {}", user);
                
            UserProfileDto userProfile = new UserProfileDto(
                user.getName(),
                user.getSurname(),
                user.getEmail()
            );
            logger.info("Returning user profile: {}", userProfile);
                
            return ResponseEntity.ok(userProfile);
        } catch (Exception e) {
            logger.error("Error in getProfile: ", e);
            throw e;
        }
    }
} 
package com.treninkovydenik.treninkovy_denik.service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.treninkovydenik.treninkovy_denik.model.User;
import com.treninkovydenik.treninkovy_denik.repository.UserRepository;
import com.treninkovydenik.treninkovy_denik.dto.RegisterRequest;
import com.treninkovydenik.treninkovy_denik.dto.LoginRequest;
import java.util.Collections;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email).isPresent()) {
            throw new RuntimeException("Email already in use");
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
            .filter(user -> passwordEncoder.matches(request.password, user.getPassword()))
            .orElseThrow(() -> new RuntimeException("Invalid credentials"));
    }
}

import React, { useState } from "react";

const AuthForm = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState("login"); // "login" or "register"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState(""); // only for register
  const [surname, setSurname] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const endpoint =
      mode === "login" ? "/api/auth/login" : "/api/auth/register";

    const payload =
      mode === "login"
        ? { email, password }
        : { name, surname, email, password };

    const res = await fetch(`http://localhost:8080${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      localStorage.setItem("token", data.token);
      onAuthSuccess();
    } else {
      setError("Chyba přihlášení nebo registrace.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white shadow-md p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">
        {mode === "login" ? "Přihlášení" : "Registrace"}
      </h2>

      {error && <div className="text-red-500 mb-4">{error}</div>}

      <form onSubmit={handleSubmit}>
        {mode === "register" && (
          <>
            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Jméno"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              className="w-full mb-3 p-2 border rounded"
              placeholder="Příjmení"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              required
            />
          </>
        )}
        <input
          className="w-full mb-3 p-2 border rounded"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="w-full mb-3 p-2 border rounded"
          type="password"
          placeholder="Heslo"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
          type="submit"
        >
          {mode === "login" ? "Přihlásit se" : "Registrovat se"}
        </button>
      </form>

      <div className="mt-4 text-center text-sm">
        {mode === "login" ? (
          <>
            Nemáte účet?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setMode("register")}
            >
              Zaregistrujte se
            </button>
          </>
        ) : (
          <>
            Máte účet?{" "}
            <button
              className="text-blue-600 hover:underline"
              onClick={() => setMode("login")}
            >
              Přihlaste se
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthForm;


import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProfilePage from "./pages/ProfilePage"; // vytvoř si tuto komponentu
import AuthForm from "./components/AuthForm";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        !!localStorage.getItem("token")
    );

    const handleLogout = () => {
        localStorage.removeItem("token");
        setIsAuthenticated(false);
    };

    return (
            <div className="min-h-screen bg-gray-100">
                {isAuthenticated ? (
                    <div className="flex flex-col h-screen">
                        <Navbar onLogout={handleLogout} />
                        <div className="flex-1">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <div className="flex items-center justify-center h-full">
                                            <div className="text-center">
                                                <h1 className="text-3xl font-montserrat mb-6">
                                                    Welcome to your training app 💪
                                                </h1>
                                                <p className="text-lg mb-4">
                                                    Are you ready to start working on your self? 🥳
                                                </p>
                                                <p className="text-lg mb-4">
                                                    Use our app to track your progress and goals 💫
                                                </p>
                                                <p className="text-lg mb-4">
                                                    With us you'll be built different soon enough 🦍
                                                </p>
                                            </div>
                                        </div>
                                    }
                                />
                                <Route path="/profile" element={<ProfilePage />} />
                                {/* další route jako /training, /goals atd. */}
                            </Routes>
                        </div>
                    </div>
                ) : (
                    <div className="flex items-center justify-center h-screen">
                        <AuthForm onAuthSuccess={() => setIsAuthenticated(true)} />
                    </div>
                )}
                <Footer />
            </div>
    )
}

export default App;
