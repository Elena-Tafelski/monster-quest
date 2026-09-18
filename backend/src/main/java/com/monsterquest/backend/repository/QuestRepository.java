package com.monsterquest.backend.repository;

import com.monsterquest.backend.entity.Quest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestRepository extends JpaRepository<Quest, Long> {
    // Standard-Methode von Spring Data, um alle Quests eines Users zu finden
    List<Quest> findByUserId(Long userId);

    // AKTIV: Alle Quests des User, die nicht erledigt sind UND (keine harte Deadline ODER noch Zeit haben)
    @Query("SELECT q FROM Quest q WHERE q.user.id = :userId AND q.completed = false " +
            "AND (q.deadline IS NULL OR q.deadline > CURRENT_TIMESTAMP OR q.hardDeadline = false)")
    List<Quest> findAllActiveByUserId(@Param("userId") Long userId);

    // ARCHIV: Alle Quests des User, die erledigt sind ODER (harte Deadline haben UND Zeit abgelaufen ist)
    @Query("SELECT q FROM Quest q WHERE q.user.id = :userId AND (q.completed = true " +
            "OR (q.deadline IS NOT NULL AND q.deadline <= CURRENT_TIMESTAMP AND q.hardDeadline = true))")
    List<Quest> findAllArchivedByUserId(@Param("userId") Long userId);
}