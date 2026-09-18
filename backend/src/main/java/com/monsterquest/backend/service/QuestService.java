package com.monsterquest.backend.service;

import com.monsterquest.backend.dto.QuestCreateRequest;
import com.monsterquest.backend.dto.QuestResponse;
import com.monsterquest.backend.dto.QuestUpdateRequest;
import com.monsterquest.backend.entity.Quest;
import com.monsterquest.backend.entity.User;
import com.monsterquest.backend.repository.QuestRepository;
import com.monsterquest.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestService {

    private final QuestRepository questRepository;
    private final UserRepository userRepository;

    // Holt alle Quests für den angemeldeten User
    public List<QuestResponse> getAllQuests(Long userId) {
        return questRepository.findByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Holt die aktiven Quests des Users
    public List<QuestResponse> getActiveQuests(Long userId) {
        return questRepository.findAllActiveByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    // Holt die archivierten Quests des Users
    public List<QuestResponse> getArchivedQuests(Long userId) {
        return questRepository.findAllArchivedByUserId(userId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    public QuestResponse createQuest(QuestCreateRequest dto, Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));

        Quest quest = new Quest();
        // DTO auf die Entity mappen
        quest.setTitle(dto.getTitle());
        quest.setDescription(dto.getDescription());
        quest.setDifficulty(dto.getDifficulty());
        quest.setDeadline(dto.getDeadline());
        quest.setHardDeadline(dto.isHardDeadline());
        quest.setRecurrence(dto.getRecurrence());
        quest.setCompleted(false);
        quest.setUser(user);

        // Speichern
        Quest savedQuest = questRepository.save(quest);

        // Entity auf das Response DTO mappen
        return mapToResponse(savedQuest);
    }

    public Optional<QuestResponse> updateQuest(Long id, QuestUpdateRequest dto, Long userId) {
        return questRepository.findById(id).map(quest -> {
            // SICHERHEITS-CHECK: Gehört die Quest dem angemeldeten User?
            if (!quest.getUser().getId().equals(userId)) {
                throw new RuntimeException("Du bist nicht berechtigt, diese Quest zu bearbeiten!");
            }

            quest.setTitle(dto.getTitle());
            quest.setDescription(dto.getDescription());
            quest.setDifficulty(dto.getDifficulty());
            quest.setDeadline(dto.getDeadline());
            quest.setHardDeadline(dto.isHardDeadline());
            quest.setRecurrence(dto.getRecurrence());
            quest.setCompleted(dto.isCompleted());

            Quest updatedQuest = questRepository.save(quest);

            return mapToResponse(updatedQuest);
        });
    }

    public boolean deleteQuest(Long id, Long userId) {
        return questRepository.findById(id).map(quest -> {
            // SICHERHEITS-CHECK: Gehört die Quest dem angemeldeten User?
            if (!quest.getUser().getId().equals(userId)) {
                throw new RuntimeException("Du bist nicht berechtigt, diese Quest zu löschen!");
            }

            questRepository.delete(quest);
            return true;
        }).orElse(false);
    }

    private QuestResponse mapToResponse(Quest quest) {
        QuestResponse response = new QuestResponse();
        response.setId(quest.getId());
        response.setTitle(quest.getTitle());
        response.setDescription(quest.getDescription());
        response.setDifficulty(quest.getDifficulty());
        response.setDeadline(quest.getDeadline());
        response.setHardDeadline(quest.isHardDeadline());
        response.setRecurrence(quest.getRecurrence().name());
        response.setCompleted(quest.isCompleted());
        response.setUserId(quest.getUser().getId());
        return response;
    }
}