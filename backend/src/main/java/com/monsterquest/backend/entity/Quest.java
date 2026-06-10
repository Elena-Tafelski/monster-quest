package com.monsterquest.backend.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "quests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Quest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String title;

    @Column(length = 500)
    private String description; // Optional

    private int difficulty;

    private LocalDateTime deadline; // Optional

    private boolean hardDeadline = false;

    @Enumerated(EnumType.STRING)
    private Recurrence recurrence = Recurrence.NONE;

    private boolean completed = false;

    @PrePersist
    @PreUpdate
    private void sanitize() {
        if (description != null && description.isBlank()) {
            description = null;
        }
    }
}