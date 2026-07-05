package com.monsterquest.backend.dto;

import lombok.Getter;
import lombok.Setter;
import java.time.LocalDateTime;

@Getter
@Setter
public class QuestResponse {
    private Long id;
    private String title;
    private String description;
    private int difficulty;
    private LocalDateTime deadline;
    private boolean hardDeadline;
    private String recurrence;
    private boolean completed;
    private Long userId;
}
