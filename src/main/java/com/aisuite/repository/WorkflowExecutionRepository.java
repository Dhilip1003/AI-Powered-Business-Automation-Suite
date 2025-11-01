package com.aisuite.repository;

import com.aisuite.model.WorkflowExecution;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface WorkflowExecutionRepository extends JpaRepository<WorkflowExecution, Long> {
    List<WorkflowExecution> findByWorkflowId(Long workflowId);
    List<WorkflowExecution> findByStatus(WorkflowExecution.ExecutionStatus status);
}

