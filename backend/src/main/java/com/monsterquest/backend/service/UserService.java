package com.monsterquest.backend.service;

import com.monsterquest.backend.dto.UserRegisterRequest;
import com.monsterquest.backend.entity.User;
import com.monsterquest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    public User registerUser(UserRegisterRequest dto) {
        // 1. Prüfen, ob Username existiert
        if (userRepository.findByUsername(dto.getUsername()).isPresent()) {
            throw new RuntimeException("Username ist bereits vergeben!");
        }

        // 2. Prüfen, ob E-Mail existiert
        if (userRepository.findByEmail(dto.getEmail()).isPresent()) {
            throw new RuntimeException("E-Mail wird bereits verwendet!");
        }

        // 3. User anlegen
        User user = new User();
        user.setUsername(dto.getUsername());
        user.setEmail(dto.getEmail());

        // Passwort wird durch den BCryptPasswordEncoder von Spring Security gejagt (Hashing)
        user.setPasswordHash(passwordEncoder.encode(dto.getPassword()));

        return userRepository.save(user);
    }
}
