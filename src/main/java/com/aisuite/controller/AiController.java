package com.aisuite.controller;

import com.aisuite.service.AiService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/ai")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AiController {
    
    private final AiService aiService;
    
    @PostMapping("/process")
    public ResponseEntity<Map<String, Object>> processWithAI(
            @RequestBody Map<String, Object> request) {
        String prompt = (String) request.get("prompt");
        @SuppressWarnings("unchecked")
        Map<String, Object> context = (Map<String, Object>) request.getOrDefault("context", new HashMap<>());
        
        String result = aiService.processWithAI(prompt, context);
        
        Map<String, Object> response = new HashMap<>();
        response.put("result", result);
        response.put("success", true);
        
        return ResponseEntity.ok(response);
    }
    
    @PostMapping("/analyze")
    public ResponseEntity<Map<String, Object>> analyzeData(
            @RequestBody Map<String, Object> request) {
        String data = (String) request.get("data");
        String analysisType = (String) request.getOrDefault("analysisType", "general");
        
        Map<String, Object> result = aiService.analyzeDataWithAI(data, analysisType);
        result.put("success", true);
        
        return ResponseEntity.ok(result);
    }
    
    @PostMapping("/decision")
    public ResponseEntity<Map<String, Object>> generateDecision(
            @RequestBody Map<String, Object> request) {
        String scenario = (String) request.get("scenario");
        @SuppressWarnings("unchecked")
        Map<String, Object> parameters = (Map<String, Object>) request.getOrDefault("parameters", new HashMap<>());
        
        String decision = aiService.generateDecision(scenario, parameters);
        
        Map<String, Object> response = new HashMap<>();
        response.put("decision", decision);
        response.put("success", true);
        
        return ResponseEntity.ok(response);
    }
}

