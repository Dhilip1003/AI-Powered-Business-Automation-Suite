package com.aisuite.service;

import com.aisuite.model.Workflow;
import com.aisuite.model.WorkflowExecution;
import com.aisuite.repository.WorkflowExecutionRepository;
import com.aisuite.repository.WorkflowRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class WorkflowService {
    
    private final WorkflowRepository workflowRepository;
    private final WorkflowExecutionRepository executionRepository;
    
    public List<Workflow> getAllWorkflows() {
        return workflowRepository.findAll();
    }
    
    public Optional<Workflow> getWorkflowById(Long id) {
        return workflowRepository.findById(id);
    }
    
    @Transactional
    public Workflow createWorkflow(Workflow workflow) {
        if (workflow.getStatus() == null) {
            workflow.setStatus(Workflow.WorkflowStatus.DRAFT);
        }
        return workflowRepository.save(workflow);
    }
    
    @Transactional
    public Workflow updateWorkflow(Long id, Workflow workflowDetails) {
        Workflow workflow = workflowRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Workflow not found: " + id));
        
        workflow.setName(workflowDetails.getName());
        workflow.setDescription(workflowDetails.getDescription());
        workflow.setStatus(workflowDetails.getStatus());
        if (workflowDetails.getSteps() != null) {
            workflow.setSteps(workflowDetails.getSteps());
        }
        
        return workflowRepository.save(workflow);
    }
    
    @Transactional
    public void deleteWorkflow(Long id) {
        workflowRepository.deleteById(id);
    }
    
    public List<WorkflowExecution> getWorkflowExecutions(Long workflowId) {
        return executionRepository.findByWorkflowId(workflowId);
    }
}

