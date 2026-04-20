package com.monsterquest.backend.service;

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

    public Quest createQuest(Quest quest) {
        return questRepository.save(quest);
    }

    public Optional<Quest> updateQuest(Long id, Quest details) {
        return questRepository.findById(id).map(quest -> {
            // Mapping der Felder
            quest.setTitle(details.getTitle());
            quest.setDescription(details.getDescription());
            quest.setDifficulty(details.getDifficulty());
            quest.setDeadline(details.getDeadline());
            quest.setHardDeadline(details.isHardDeadline());
            quest.setRecurrence(details.getRecurrence());
            quest.setCompleted(details.isCompleted());
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