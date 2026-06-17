package com.monsterquest.backend.service;

import com.monsterquest.backend.dto.QuestCreateRequest;
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
    public List<Quest> getAllQuests(Long userId) {
        return questRepository.findByUserId(userId);
    }

    // Holt die aktiven Quests des Users
    public List<Quest> getActiveQuests(Long userId) {
        return questRepository.findAllActiveByUserId(userId);
    }

    // Holt die archivierten Quests des Users
    public List<Quest> getArchivedQuests(Long userId) {
        return questRepository.findAllArchivedByUserId(userId);
    }

    public Quest createQuest(QuestCreateRequest dto, Long userId) {
        Quest quest = new Quest();
        // Aus dem DTO in die Entity mappen
        quest.setTitle(dto.getTitle());
        quest.setDescription(dto.getDescription());
        quest.setDifficulty(dto.getDifficulty());
        quest.setDeadline(dto.getDeadline());
        quest.setHardDeadline(dto.isHardDeadline());
        quest.setRecurrence(dto.getRecurrence());
        quest.setCompleted(false);

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User nicht gefunden"));
        quest.setUser(user);

        return questRepository.save(quest);
    }

    public Optional<Quest> updateQuest(Long id, QuestUpdateRequest dto) {
        return questRepository.findById(id).map(quest -> {
            quest.setTitle(dto.getTitle());
            quest.setDescription(dto.getDescription());
            quest.setDifficulty(dto.getDifficulty());
            quest.setDeadline(dto.getDeadline());
            quest.setHardDeadline(dto.isHardDeadline());
            quest.setRecurrence(dto.getRecurrence());
            quest.setCompleted(dto.isCompleted());

            return questRepository.save(quest);
        });
    }

    public boolean deleteQuest(Long id) {
        if (questRepository.existsById(id)) {
            questRepository.deleteById(id);
            return true;
        }
        return false;
    }
}