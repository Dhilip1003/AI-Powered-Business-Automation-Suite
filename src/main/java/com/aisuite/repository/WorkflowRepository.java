package com.aisuite.repository;

import com.aisuite.model.Workflow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface WorkflowRepository extends JpaRepository<Workflow, Long> {
    List<Workflow> findByStatus(Workflow.WorkflowStatus status);
    Optional<Workflow> findByName(String name);
}

