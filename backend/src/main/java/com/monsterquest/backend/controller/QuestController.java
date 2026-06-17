package com.monsterquest.backend.controller;

import com.monsterquest.backend.dto.QuestCreateRequest;
import com.monsterquest.backend.dto.QuestUpdateRequest;
import com.monsterquest.backend.entity.Quest;
import com.monsterquest.backend.service.QuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/quests") // Alle Anfragen an /api/quests landen hier
@RequiredArgsConstructor
@Tag(name = "1. Quest-Verwaltung", description = "Endpoints für den Lebenszyklus von Quests (Erstellen, Bearbeiten, Löschen)")
public class QuestController {

    private final QuestService questService;

    // SIMULATION: Später holen wir diese ID automatisch aus dem Login-Token!
    // Für den Moment tun wir so, als wäre immer der User mit der ID 1 eingeloggt.
    private final Long temporaryMockUserId = 1L;

    @GetMapping
    @Operation(summary = "Alle Quests abrufen", description = "Liefert eine komplette Liste aller Quests des aktuell angemeldeten Users (aktiv und archiviert).")
    public List<Quest> getAll() {
        return questService.getAllQuests(temporaryMockUserId);
    }

    @GetMapping("/active")
    @Operation(summary = "Aktive Quests filtern", description = "Liefert alle offenen Quests des aktuellen Users, deren harte Deadline noch nicht abgelaufen ist.")
    public List<Quest> getActive() {
        return questService.getActiveQuests(temporaryMockUserId);
    }

    @GetMapping("/archive")
    @Operation(summary = "Archivierte Quests filtern", description = "Liefert alle erledigten oder aufgrund einer harten Deadline abgelaufenen Quests des aktuellen Users.")
    public List<Quest> getArchive() {
        return questService.getArchivedQuests(temporaryMockUserId);
    }

    @PostMapping
    @Operation(summary = "Neue Quest erstellen", description = "Erstellt eine neue Quest und verknüpft sie mit dem aktuellen User.")
    @ApiResponse(responseCode = "201", description = "Quest erfolgreich erstellt")
    @ApiResponse(responseCode = "400", description = "Ungültige Eingabedaten (z. B. Titel zu kurz oder Datum in der Vergangenheit)")
    public Quest create(@Valid @RequestBody QuestCreateRequest dto) {
        return questService.createQuest(dto, temporaryMockUserId);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Quest aktualisieren", description = "Aktualisiert eine bestehende Quest des Users anhand ihrer ID.")
    @ApiResponse(responseCode = "200", description = "Quest erfolgreich aktualisiert")
    @ApiResponse(responseCode = "404", description = "Quest mit der angegebenen ID wurde nicht gefunden")
    public ResponseEntity<Quest> update(@PathVariable Long id, @Valid @RequestBody QuestUpdateRequest dto) {
        return questService.updateQuest(id, dto)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Quest löschen", description = "Löscht eine bestehende Quest anhand ihrer ID.")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return questService.deleteQuest(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
