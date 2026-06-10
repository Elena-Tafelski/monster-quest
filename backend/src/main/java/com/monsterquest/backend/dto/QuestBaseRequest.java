package com.monsterquest.backend.dto;

import com.monsterquest.backend.entity.Recurrence;
import jakarta.validation.constraints.*;
import lombok.Data;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
public class QuestBaseRequest {
    @NotBlank(message = "Der Titel darf nicht leer sein")
    @Size(min = 3, max = 50)
    @Schema(description = "Der Titel der Aufgabe", example = "Drachen im Keller besiegen", requiredMode = Schema.RequiredMode.REQUIRED)
    private String title;

    @Size(max = 500)
    @Schema(description = "Optionale Details zur Quest", example = "Die Kellerdrachen klauen nachts immer die Socken aus der Waschmaschine.")
    private String description;

    @NotNull(message = "Schwierigkeit muss angegeben werden")
    @Min(value = 1, message = "Die Schwierigkeit muss mindestens 1 sein")
    @Max(value = 10, message = "Die Schwierigkeit darf maximal 10 sein")
    @Schema(description = "Schwierigkeitsgrad der Quest von 1 (sehr leicht) bis 10 (episch)", example = "4", requiredMode = Schema.RequiredMode.REQUIRED)
    private int difficulty;

    @Schema(description = "Zeitpunkt, bis wann die Quest erledigt sein muss (ISO-Format)", example = "2026-12-31T23:59:59")
    private LocalDateTime deadline;

    @Schema(description = "Wenn true, gilt die Quest nach Ablauf der Deadline sofort als gescheitert", example = "false")
    private boolean hardDeadline;

    @Schema(description = "Wiederholungsintervall der Quest", example = "NONE")
    private Recurrence recurrence;

    @AssertTrue(message = "Ohne Datum sind harte Fristen oder Wiederholungen nicht erlaubt!")
    public boolean isDeadlineLogicValid() {
        if (deadline == null) {
            return !hardDeadline && recurrence == Recurrence.NONE;
        }
        return true;
    }
}
