package com.aisuite.controller;

import com.aisuite.model.Workflow;
import com.aisuite.model.WorkflowExecution;
import com.aisuite.service.WorkflowEngine;
import com.aisuite.service.WorkflowService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/workflows")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class WorkflowController {
    
    private final WorkflowService workflowService;
    private final WorkflowEngine workflowEngine;
    
    @GetMapping
    public ResponseEntity<List<Workflow>> getAllWorkflows() {
        return ResponseEntity.ok(workflowService.getAllWorkflows());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Workflow> getWorkflow(@PathVariable Long id) {
        return workflowService.getWorkflowById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Workflow> createWorkflow(@RequestBody Workflow workflow) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(workflowService.createWorkflow(workflow));
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Workflow> updateWorkflow(
            @PathVariable Long id, 
            @RequestBody Workflow workflow) {
        return ResponseEntity.ok(workflowService.updateWorkflow(id, workflow));
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteWorkflow(@PathVariable Long id) {
        workflowService.deleteWorkflow(id);
        return ResponseEntity.noContent().build();
    }
    
    @PostMapping("/{id}/execute")
    public ResponseEntity<WorkflowExecution> executeWorkflow(
            @PathVariable Long id,
            @RequestBody Map<String, Object> inputData) {
        WorkflowExecution execution = workflowEngine.executeWorkflow(id, inputData);
        return ResponseEntity.ok(execution);
    }
    
    @GetMapping("/{id}/executions")
    public ResponseEntity<List<WorkflowExecution>> getWorkflowExecutions(@PathVariable Long id) {
        return ResponseEntity.ok(workflowService.getWorkflowExecutions(id));
    }
}

