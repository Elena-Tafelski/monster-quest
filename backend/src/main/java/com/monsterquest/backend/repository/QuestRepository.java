package com.monsterquest.backend.repository;

import com.monsterquest.backend.entity.Quest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestRepository extends JpaRepository<Quest, Long> {
    // AKTIV: Alles, was nicht erledigt ist UND (keine harte Deadline hat ODER noch Zeit hat)
    @Query("SELECT q FROM Quest q WHERE q.completed = false " +
            "AND (q.deadline IS NULL OR q.deadline > CURRENT_TIMESTAMP OR q.hardDeadline = false)")
    List<Quest> findAllActive();

    // ARCHIV: Alles, was erledigt ist ODER (harte Deadline UND Zeit abgelaufen)
    @Query("SELECT q FROM Quest q WHERE q.completed = true " +
            "OR (q.deadline IS NOT NULL AND q.deadline <= CURRENT_TIMESTAMP AND q.hardDeadline = true)")
    List<Quest> findAllArchived();
}