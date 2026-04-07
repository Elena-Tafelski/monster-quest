package com.monsterquest.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class BackendApplication {

    public static void main(String[] args) {
        Dotenv dotenv = loadDotenv();

        // Macht die Variablen für Spring verfügbar
        dotenv.entries().forEach(entry -> System.setProperty(entry.getKey(), entry.getValue()));

        SpringApplication.run(BackendApplication.class, args);
    }

    private static Dotenv loadDotenv() {
        // Prüfen ob .env im aktuellen Verzeichnis existiert
        if (new java.io.File(".env").exists()) {
            return Dotenv.configure().directory("./").load();
        }
        // Sonst eine Ebene höher (Konsole aus backend/)
        if (new java.io.File("../.env").exists()) {
            return Dotenv.configure().directory("../").load();
        }
        // Fallback: ignoreIfMissing
        return Dotenv.configure().ignoreIfMissing().load();
    }
}
