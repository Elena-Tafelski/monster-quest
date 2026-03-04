package com.monsterquest.backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
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

    @NotBlank(message = "Der Titel darf nicht leer sein")
    @Size(min = 3, max = 50)
    @Column(nullable = false)
    private String title;

    @Size(max = 500)
    private String description; // Optional (keine Annotation)

    @NotNull(message = "Schwierigkeit muss angegeben werden")
    @Min(value = 1, message = "Die Schwierigkeit muss mindestens 1 sein")
    @Max(value = 10, message = "Die Schwierigkeit darf maximal 10 sein")
    private int difficulty;

    @FutureOrPresent(message = "Deadline muss in der Zukunft liegen")
    private LocalDateTime deadline; // Optional

    private boolean hardDeadline = false;

    @Enumerated(EnumType.STRING)
    private Recurrence recurrence = Recurrence.NONE;

    private boolean completed = false;
}