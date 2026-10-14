package com.skillswap.service;

import com.skillswap.dto.GoogleAuthRequest;
import com.skillswap.dto.LoginRequest;
import com.skillswap.dto.RegisterRequest;
import com.skillswap.entity.User;
import com.skillswap.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    public User register(RegisterRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        if (userRepository.existsByEmail(email)) {
            throw new IllegalArgumentException("An account with this email already exists.");
        }

        User user = new User();
        user.setName(request.getName().trim());
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(LocalDateTime.now());
        user.setLocation("India");

        return userRepository.save(user);
    }

    public User login(LoginRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Invalid email or password.");
        }

        return user;
    }

    public User googleLogin(GoogleAuthRequest request) {
        String email = request.getEmail().trim().toLowerCase();

        return userRepository.findByEmail(email).map(existingUser -> {
            if (request.getAvatar() != null && existingUser.getAvatar() == null) {
                existingUser.setAvatar(request.getAvatar());
                return userRepository.save(existingUser);
            }
            return existingUser;
        }).orElseGet(() -> {
            User newUser = new User();
            newUser.setName(request.getName().trim());
            newUser.setEmail(email);
            newUser.setPassword(passwordEncoder.encode(UUID.randomUUID().toString()));
            newUser.setAvatar(request.getAvatar());
            newUser.setLocation("India");
            newUser.setCreatedAt(LocalDateTime.now());
            return userRepository.save(newUser);
        });
    }
}
