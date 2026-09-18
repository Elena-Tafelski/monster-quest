package com.monsterquest.backend.controller;

import com.monsterquest.backend.dto.QuestCreateRequest;
import com.monsterquest.backend.dto.QuestResponse;
import com.monsterquest.backend.dto.QuestUpdateRequest;
import com.monsterquest.backend.entity.User;
import com.monsterquest.backend.repository.UserRepository;
import com.monsterquest.backend.service.QuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

import java.util.List;

@RestController
@RequestMapping("/api/quests")
@RequiredArgsConstructor
@Tag(name = "1. Quest-Verwaltung", description = "Endpoints für den Lebenszyklus von Quests (Erstellen, Bearbeiten, Löschen)")
public class QuestController {

    private final QuestService questService;
    private final UserRepository userRepository;

    // Hilfsmethode: Holt die ID des aktuell über JWT eingeloggten Users
    private Long getCurrentUserId() {
        // Der Filter hat den Usernamen im SecurityContext abgelegt
        String username = (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();

        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("Eingeloggter User nicht in DB gefunden"));
        return user.getId();
    }

    @GetMapping
    @Operation(summary = "Alle Quests abrufen", description = "Liefert eine komplette Liste aller Quests des aktuell angemeldeten Users (aktiv und archiviert).")
    public List<QuestResponse> getAll() {
        return questService.getAllQuests(getCurrentUserId());
    }

    @GetMapping("/active")
    @Operation(summary = "Aktive Quests filtern", description = "Liefert alle offenen Quests des aktuellen Users, deren harte Deadline noch nicht abgelaufen ist.")
    public List<QuestResponse> getActive() {
        return questService.getActiveQuests(getCurrentUserId());
    }

    @GetMapping("/archive")
    @Operation(summary = "Archivierte Quests filtern", description = "Liefert alle erledigten oder aufgrund einer harten Deadline abgelaufenen Quests des aktuellen Users.")
    public List<QuestResponse> getArchive() {
        return questService.getArchivedQuests(getCurrentUserId());
    }

    @PostMapping
    @Operation(summary = "Neue Quest erstellen", description = "Erstellt eine neue Quest und verknüpft sie mit dem aktuellen User.")
    @ApiResponse(responseCode = "201", description = "Quest erfolgreich erstellt")
    @ApiResponse(responseCode = "400", description = "Ungültige Eingabedaten (z. B. Titel zu kurz oder Datum in der Vergangenheit)")
    public QuestResponse create(@Valid @RequestBody QuestCreateRequest dto) {
        return questService.createQuest(dto, getCurrentUserId());
    }

    @PutMapping("/{id}")
    @Operation(summary = "Quest aktualisieren", description = "Aktualisiert eine bestehende Quest des Users anhand ihrer ID.")
    @ApiResponse(responseCode = "200", description = "Quest erfolgreich aktualisiert")
    @ApiResponse(responseCode = "404", description = "Quest mit der angegebenen ID wurde nicht gefunden")
    public ResponseEntity<QuestResponse> update(@PathVariable Long id, @Valid @RequestBody QuestUpdateRequest dto) {
        return questService.updateQuest(id, dto, getCurrentUserId())
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Quest löschen", description = "Löscht eine bestehende Quest anhand ihrer ID.")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return questService.deleteQuest(id, getCurrentUserId())
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
