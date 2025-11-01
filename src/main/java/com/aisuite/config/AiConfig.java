package com.aisuite.config;

import lombok.Data;
import org.springframework.boot.context.properties.ConfigurationProperties;
import org.springframework.context.annotation.Configuration;

@Configuration
@ConfigurationProperties(prefix = "ai")
@Data
public class AiConfig {
    
    private OpenAI openai = new OpenAI();
    private Automation automation = new Automation();
    
    @Data
    public static class OpenAI {
        private String apiKey;
        private String baseUrl = "https://api.openai.com/v1";
        private String model = "gpt-3.5-turbo";
        private Integer maxTokens = 1000;
        private Double temperature = 0.7;
    }
    
    @Data
    public static class Automation {
        private Integer maxRetries = 3;
        private Integer timeoutSeconds = 30;
        private Boolean enableLogging = true;
    }
}

