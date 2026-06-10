package com.monsterquest.backend.service;

import com.monsterquest.backend.dto.QuestCreateRequest;
import com.monsterquest.backend.dto.QuestUpdateRequest;
import com.monsterquest.backend.entity.Quest;
import com.monsterquest.backend.repository.QuestRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class QuestService {

    private final QuestRepository questRepository;

    public List<Quest> getAllQuests() {
        return questRepository.findAll();
    }

    public List<Quest> getActiveQuests() {
        return questRepository.findAllActive();
    }

    public List<Quest> getArchivedQuests() {
        return questRepository.findAllArchived();
    }

    public Quest createQuest(QuestCreateRequest dto) {
        Quest quest = new Quest();
        // Aus dem DTO in die Entity mappen
        quest.setTitle(dto.getTitle());
        quest.setDescription(dto.getDescription());
        quest.setDifficulty(dto.getDifficulty());
        quest.setDeadline(dto.getDeadline());
        quest.setHardDeadline(dto.isHardDeadline());
        quest.setRecurrence(dto.getRecurrence());
        quest.setCompleted(false);

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