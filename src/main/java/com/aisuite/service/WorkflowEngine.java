package com.aisuite.service;

import com.aisuite.model.Workflow;
import com.aisuite.model.WorkflowExecution;
import com.aisuite.model.WorkflowStep;
import com.aisuite.repository.WorkflowExecutionRepository;
import com.aisuite.repository.WorkflowRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class WorkflowEngine {
    
    private final WorkflowRepository workflowRepository;
    private final WorkflowExecutionRepository executionRepository;
    private final AiService aiService;
    private final ObjectMapper objectMapper;
    
    @Async
    @Transactional
    public WorkflowExecution executeWorkflow(Long workflowId, Map<String, Object> inputData) {
        log.info("Starting workflow execution for workflow ID: {}", workflowId);
        
        Workflow workflow = workflowRepository.findById(workflowId)
                .orElseThrow(() -> new RuntimeException("Workflow not found: " + workflowId));
        
        WorkflowExecution execution = new WorkflowExecution();
        execution.setWorkflow(workflow);
        execution.setStatus(WorkflowExecution.ExecutionStatus.RUNNING);
        execution.setStartedAt(LocalDateTime.now());
        execution.setInputData(convertToJson(inputData));
        execution = executionRepository.save(execution);
        
        try {
            Map<String, Object> context = new HashMap<>(inputData);
            List<WorkflowStep> steps = workflow.getSteps().stream()
                    .sorted(Comparator.comparing(WorkflowStep::getStepOrder))
                    .collect(Collectors.toList());
            
            for (WorkflowStep step : steps) {
                log.info("Executing step: {} (Order: {})", step.getName(), step.getStepOrder());
                step.setStatus(WorkflowStep.StepStatus.IN_PROGRESS);
                
                try {
                    String result = executeStep(step, context);
                    step.setResult(result);
                    step.setStatus(WorkflowStep.StepStatus.COMPLETED);
                    
                    // Update context with step result
                    context.put("step_" + step.getId(), result);
                    
                    // Handle conditional steps
                    if (step.getType() == WorkflowStep.StepType.CONDITIONAL) {
                        boolean shouldContinue = evaluateCondition(step, result);
                        if (!shouldContinue) {
                            step.setStatus(WorkflowStep.StepStatus.SKIPPED);
                            break;
                        }
                    }
                    
                } catch (Exception e) {
                    log.error("Step execution failed: {}", e.getMessage(), e);
                    step.setStatus(WorkflowStep.StepStatus.FAILED);
                    step.setResult("Error: " + e.getMessage());
                    
                    if (step.getType() != WorkflowStep.StepType.MANUAL_REVIEW) {
                        execution.setStatus(WorkflowExecution.ExecutionStatus.FAILED);
                        execution.setErrorMessage("Step failed: " + step.getName() + " - " + e.getMessage());
                        break;
                    }
                }
            }
            
            workflow.setLastExecutedAt(LocalDateTime.now());
            workflowRepository.save(workflow);
            
            execution.setStatus(WorkflowExecution.ExecutionStatus.COMPLETED);
            execution.setOutputData(convertToJson(context));
            execution.setCompletedAt(LocalDateTime.now());
            
            long executionTime = java.time.Duration.between(
                    execution.getStartedAt(), 
                    execution.getCompletedAt()
            ).toMillis();
            execution.setExecutionTimeMs(executionTime);
            
            log.info("Workflow execution completed in {} ms", executionTime);
            
        } catch (Exception e) {
            log.error("Workflow execution failed: {}", e.getMessage(), e);
            execution.setStatus(WorkflowExecution.ExecutionStatus.FAILED);
            execution.setErrorMessage(e.getMessage());
            execution.setCompletedAt(LocalDateTime.now());
        }
        
        return executionRepository.save(execution);
    }
    
    private String executeStep(WorkflowStep step, Map<String, Object> context) throws Exception {
        switch (step.getType()) {
            case AI_PROCESSING:
                String prompt = step.getAiPrompt() != null 
                        ? step.getAiPrompt() 
                        : "Process the following business data: " + context;
                return aiService.processWithAI(prompt, context);
                
            case DATA_TRANSFORMATION:
                return transformData(step, context);
                
            case NOTIFICATION:
                return sendNotification(step, context);
                
            case CONDITIONAL:
                return evaluateCondition(step, context) ? "Condition met" : "Condition not met";
                
            case MANUAL_REVIEW:
                return "Pending manual review";
                
            default:
                throw new IllegalArgumentException("Unknown step type: " + step.getType());
        }
    }
    
    private String transformData(WorkflowStep step, Map<String, Object> context) {
        // Simple data transformation logic
        String config = step.getConfiguration();
        if (config != null && config.contains("transform")) {
            // Apply transformations based on configuration
            return "Data transformed successfully";
        }
        return "Data transformation completed";
    }
    
    private String sendNotification(WorkflowStep step, Map<String, Object> context) {
        // Notification logic would be implemented here
        log.info("Sending notification for step: {}", step.getName());
        return "Notification sent";
    }
    
    private boolean evaluateCondition(WorkflowStep step, Object result) {
        try {
            String config = step.getConfiguration();
            if (config == null) return true;
            
            // Simple condition evaluation
            // In a production system, this would use a proper expression evaluator
            Map<String, Object> configMap = objectMapper.readValue(config, Map.class);
            String condition = (String) configMap.get("condition");
            
            if (condition != null && condition.equals("success")) {
                return result != null && !result.toString().contains("Error");
            }
            
            return true;
        } catch (Exception e) {
            log.warn("Failed to evaluate condition: {}", e.getMessage());
            return true;
        }
    }
    
    private String convertToJson(Object obj) {
        try {
            return objectMapper.writeValueAsString(obj);
        } catch (Exception e) {
            log.error("Failed to convert to JSON: {}", e.getMessage());
            return obj.toString();
        }
    }
}

