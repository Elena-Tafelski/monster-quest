package com.monsterquest.backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import io.swagger.v3.oas.annotations.media.Schema;

@Getter
@Setter
public class UserRegisterRequest {
    @NotBlank(message = "Username darf nicht leer sein")
    @Size(min = 3, max = 20, message = "Username muss zwischen 3 und 20 Zeichen lang sein")
    @Schema(example = "monsterhunter99")
    private String username;

    @NotBlank(message = "Email darf nicht leer sein")
    @Email(message = "Bitte eine gültige E-Mail-Adresse angeben")
    @Schema(example = "hunter@quest.de")
    private String email;

    @NotBlank(message = "Passwort darf nicht leer sein")
    @Size(min = 6, message = "Passwort muss mindestens 6 Zeichen lang sein")
    @Schema(example = "geheimesPasswort123")
    private String password;
}
