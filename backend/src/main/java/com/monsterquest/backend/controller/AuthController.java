package com.monsterquest.backend.controller;

import com.monsterquest.backend.dto.AuthResponse;
import com.monsterquest.backend.dto.UserLoginRequest;
import com.monsterquest.backend.dto.UserRegisterRequest;
import com.monsterquest.backend.entity.User;
import com.monsterquest.backend.repository.UserRepository;
import com.monsterquest.backend.security.JwtUtil;
import com.monsterquest.backend.service.UserService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@Tag(name = "2. Benutzer-Verwaltung", description = "Endpoints für Registrierung und Login")
public class AuthController {
    private final UserService userService;
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    private final BCryptPasswordEncoder passwordEncoder = new BCryptPasswordEncoder();

    @PostMapping("/register")
    @Operation(summary = "Neuen Account registrieren", description = "Erstellt einen neuen Benutzer, falls Username und E-Mail noch frei sind.")
    public ResponseEntity<?> register(@Valid @RequestBody UserRegisterRequest dto) {
        try {
            User registeredUser = userService.registerUser(dto);
            return ResponseEntity.ok("Benutzer erfolgreich registriert mit ID: " + registeredUser.getId());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/login")
    @Operation(summary = "Einloggen", description = "Prüft die Credentials und gibt ein JWT-Token zurück.")
    public ResponseEntity<?> login(@Valid @RequestBody UserLoginRequest dto) {
        // 1. User aus DB suchen
        User user = userRepository.findByUsername(dto.getUsername())
                .orElse(null);

        // 2. Prüfen ob User existiert und das Passwort (verschlüsselt) übereinstimmt
        if (user == null || !passwordEncoder.matches(dto.getPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(401).body("Ungültiger Username oder Passwort!");
        }

        // 3. Token generieren
        String token = jwtUtil.generateToken(user.getUsername());

        // 4. Token und Username zurückgeben
        return ResponseEntity.ok(new AuthResponse(token, user.getUsername()));
    }
}
