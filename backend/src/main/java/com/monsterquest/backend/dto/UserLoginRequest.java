package com.monsterquest.backend.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class UserLoginRequest {
    @NotBlank(message = "Username darf nicht leer sein")
    @Schema(example = "monsterhunter99")
    private String username;

    @NotBlank(message = "Passwort darf nicht leer sein")
    @Schema(example = "geheimesPasswort123")
    private String password;
}
