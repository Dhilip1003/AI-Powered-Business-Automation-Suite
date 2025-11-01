package com.aisuite.service;

import com.aisuite.config.AiConfig;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.reactive.function.client.WebClient;
import reactor.core.publisher.Mono;
import reactor.util.retry.Retry;

import java.time.Duration;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@Slf4j
public class AiService {
    
    private final AiConfig aiConfig;
    private final WebClient webClient;
    private final ObjectMapper objectMapper;
    
    public AiService(AiConfig aiConfig, ObjectMapper objectMapper) {
        this.aiConfig = aiConfig;
        this.objectMapper = objectMapper;
        this.webClient = WebClient.builder()
                .baseUrl(aiConfig.getOpenai().getBaseUrl())
                .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
                .defaultHeader(HttpHeaders.AUTHORIZATION, "Bearer " + aiConfig.getOpenai().getApiKey())
                .build();
    }
    
    public String processWithAI(String prompt, Map<String, Object> context) {
        try {
            log.info("Processing AI request with prompt: {}", prompt);
            
            Map<String, Object> requestBody = buildRequest(prompt, context);
            
            String response = webClient.post()
                    .uri("/chat/completions")
                    .bodyValue(requestBody)
                    .retrieve()
                    .bodyToMono(String.class)
                    .retryWhen(Retry.fixedDelay(aiConfig.getAutomation().getMaxRetries(), 
                            Duration.ofSeconds(2)))
                    .timeout(Duration.ofSeconds(aiConfig.getAutomation().getTimeoutSeconds()))
                    .block();
            
            JsonNode jsonResponse = objectMapper.readTree(response);
            String aiResponse = jsonResponse.get("choices")
                    .get(0)
                    .get("message")
                    .get("content")
                    .asText();
            
            log.info("AI processing completed successfully");
            return aiResponse;
            
        } catch (Exception e) {
            log.error("Error processing AI request: {}", e.getMessage(), e);
            throw new RuntimeException("AI processing failed: " + e.getMessage(), e);
        }
    }
    
    public Map<String, Object> analyzeDataWithAI(String data, String analysisType) {
        String prompt = String.format(
                "Analyze the following %s data and provide structured insights:\n\n%s\n\n" +
                "Provide a JSON response with: summary, keyFindings, recommendations, and riskLevel",
                analysisType, data
        );
        
        String aiResponse = processWithAI(prompt, Map.of("analysisType", analysisType));
        
        try {
            JsonNode jsonNode = objectMapper.readTree(aiResponse);
            Map<String, Object> result = new HashMap<>();
            result.put("summary", jsonNode.path("summary").asText("Analysis completed"));
            result.put("keyFindings", jsonNode.path("keyFindings"));
            result.put("recommendations", jsonNode.path("recommendations"));
            result.put("riskLevel", jsonNode.path("riskLevel").asText("MEDIUM"));
            return result;
        } catch (Exception e) {
            log.warn("Failed to parse AI response as JSON, returning raw response");
            Map<String, Object> result = new HashMap<>();
            result.put("rawResponse", aiResponse);
            return result;
        }
    }
    
    public String generateDecision(String scenario, Map<String, Object> parameters) {
        String prompt = String.format(
                "Given the following business scenario and parameters, provide a decision:\n\n" +
                "Scenario: %s\nParameters: %s\n\n" +
                "Provide a clear decision with reasoning.",
                scenario, parameters
        );
        
        return processWithAI(prompt, parameters);
    }
    
    private Map<String, Object> buildRequest(String prompt, Map<String, Object> context) {
        Map<String, Object> request = new HashMap<>();
        
        List<Map<String, String>> messages = List.of(
                Map.of("role", "system", "content", 
                        "You are an AI assistant specialized in business process automation. " +
                        "Provide clear, actionable responses in JSON format when possible."),
                Map.of("role", "user", "content", prompt)
        );
        
        request.put("model", aiConfig.getOpenai().getModel());
        request.put("messages", messages);
        request.put("max_tokens", aiConfig.getOpenai().getMaxTokens());
        request.put("temperature", aiConfig.getOpenai().getTemperature());
        
        return request;
    }
}

