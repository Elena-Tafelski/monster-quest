package com.monsterquest.backend.security;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

@Component
public class JwtUtil {
    // Wir generieren einen sicheren, zufälligen Schlüssel für die Signatur.
    // WICHTIG: In Produktion sollte dieser Schlüssel aus den application.properties kommen!
    private final SecretKey secretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256);

    // Das Token ist 24 Stunden gültig (in Millisekunden)
    private final long jwtExpirationMs = 86400000;

    public String generateToken(String username) {
        return Jwts.builder()
                .subject(username) // Moderner JJWT 0.12+ Standard (ohne "set")
                .issuedAt(new Date())
                .expiration(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .signWith(secretKey) // Signierung mit dem sicheren Schlüssel
                .compact();
    }

    // Prüft, ob das Token gültig ist und zum User passt
    public boolean validateToken(String token, String username) {
        final String extractedUsername = extractUsername(token);
        return (extractedUsername.equals(username) && !isTokenExpired(token));
    }

    // Extrahiert den Usernamen aus dem Token
    public String extractUsername(String token) {
        return Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    // Prüft, ob das Ablaufdatum überschritten ist
    private boolean isTokenExpired(String token) {
        Date expiration = Jwts.parser()
                .verifyWith(secretKey)
                .build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration();
        return expiration.before(new Date());
    }
}
