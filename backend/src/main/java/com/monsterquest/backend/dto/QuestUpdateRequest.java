package com.monsterquest.backend.dto;

import lombok.Data;
import lombok.EqualsAndHashCode;

import io.swagger.v3.oas.annotations.media.Schema;

@Data
@EqualsAndHashCode(callSuper = true)
@Schema(description = "Datenmodell zum Aktualisieren einer bestehenden Quest. Erlaubt die Änderung des Status.")
public class QuestUpdateRequest extends QuestBaseRequest {
    @Schema(description = "Gibt an, ob die Quest erfolgreich abgeschlossen wurde", example = "true")
    private boolean completed; // Nur beim Update erlaubt/sinnvoll
}
