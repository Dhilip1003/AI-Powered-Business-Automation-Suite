package com.aisuite.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "workflow_steps")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class WorkflowStep {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "workflow_id", nullable = false)
    private Workflow workflow;
    
    @Column(nullable = false)
    private String name;
    
    @Column(nullable = false)
    private Integer stepOrder;
    
    @Enumerated(EnumType.STRING)
    private StepType type;
    
    @Column(columnDefinition = "TEXT")
    private String configuration;
    
    @Enumerated(EnumType.STRING)
    private StepStatus status;
    
    @Column(columnDefinition = "TEXT")
    private String aiPrompt;
    
    @Column(columnDefinition = "TEXT")
    private String result;
    
    public enum StepType {
        AI_PROCESSING, DATA_TRANSFORMATION, NOTIFICATION, CONDITIONAL, MANUAL_REVIEW
    }
    
    public enum StepStatus {
        PENDING, IN_PROGRESS, COMPLETED, FAILED, SKIPPED
    }
}

