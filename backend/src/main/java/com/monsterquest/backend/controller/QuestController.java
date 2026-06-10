package com.monsterquest.backend.controller;

import com.monsterquest.backend.entity.Quest;
import com.monsterquest.backend.service.QuestService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/quests") // Alle Anfragen an /api/quests landen hier
@RequiredArgsConstructor
public class QuestController {

    private final QuestService questService;

    @GetMapping
    public List<Quest> getAll() {
        return questService.getAllQuests();
    }

    @GetMapping("/active")
    public List<Quest> getActive() {
        return questService.getActiveQuests();
    }

    @GetMapping("/archive")
    public List<Quest> getArchive() {
        return questService.getArchivedQuests();
    }

    @PostMapping
    public Quest create(@Valid @RequestBody Quest quest) {
        return questService.createQuest(quest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quest> update(@PathVariable Long id, @Valid @RequestBody Quest quest) {
        return questService.updateQuest(id, quest)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        return questService.deleteQuest(id)
                ? ResponseEntity.noContent().build()
                : ResponseEntity.notFound().build();
    }
}
