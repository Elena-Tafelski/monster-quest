package com.monsterquest.backend.dto;

import jakarta.validation.constraints.FutureOrPresent;
import lombok.Data;
import lombok.EqualsAndHashCode;
import java.time.LocalDateTime;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Datenmodell zum Erstellen einer neuen Quest. Die Deadline muss in der Zukunft liegen.")
public class QuestCreateRequest extends QuestBaseRequest {
    @FutureOrPresent(message = "Deadline muss in der Zukunft liegen")
    @Override
    public LocalDateTime getDeadline() {
        return super.getDeadline();
    }
}
