package com.monsterquest.backend.controller;

import com.monsterquest.backend.entity.Quest;
import com.monsterquest.backend.repository.QuestRepository;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/quests") // Alle Anfragen an /api/quests landen hier
public class QuestController {

    private final QuestRepository questRepository;

    // Spring "injiziert" das Repository automatisch hier rein
    public QuestController(QuestRepository questRepository) {
        this.questRepository = questRepository;
    }

    @GetMapping
    public List<Quest> getAllQuests() {
        return questRepository.findAll(); // Holt alle Zeilen aus der DB
    }

    @PostMapping
    public Quest createQuest(@Valid @RequestBody Quest quest) {
        return questRepository.save(quest);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Quest> updateQuest(@PathVariable Long id, @Valid @RequestBody Quest questDetails) {
        return questRepository.findById(id)
                .map(quest -> {
                    quest.setTitle(questDetails.getTitle());
                    quest.setDescription(questDetails.getDescription());
                    quest.setDifficulty(questDetails.getDifficulty());
                    quest.setDeadline(questDetails.getDeadline());
                    quest.setHardDeadline(questDetails.isHardDeadline());
                    quest.setRecurrence(questDetails.getRecurrence());
                    quest.setCompleted(questDetails.isCompleted());
                    return ResponseEntity.ok(questRepository.save(quest));
                })
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteQuest(@PathVariable Long id) {
        if (!questRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        questRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
