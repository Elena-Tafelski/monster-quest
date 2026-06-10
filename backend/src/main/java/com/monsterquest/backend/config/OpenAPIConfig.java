package com.monsterquest.backend.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenAPIConfig {
    @Bean
    public OpenAPI customOpenAPI() {
        return new OpenAPI()
                .info(new Info()
                        .title("MonsterQuest API")
                        .version("1.0")
                        .description("Das Backend-System für das Quest- und Gamification-Management von MonsterQuest. Erlaubt das Erstellen, Verfolgen und Archivieren von Aufgaben."));
    }
}
