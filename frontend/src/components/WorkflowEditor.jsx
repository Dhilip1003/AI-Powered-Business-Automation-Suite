import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  IconButton,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { workflowService } from '../services/api';

export default function WorkflowEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [workflow, setWorkflow] = useState({
    name: '',
    description: '',
    status: 'DRAFT',
    steps: [],
  });

  useEffect(() => {
    if (id) {
      loadWorkflow();
    }
  }, [id]);

  const loadWorkflow = async () => {
    try {
      const response = await workflowService.getById(id);
      setWorkflow(response.data);
    } catch (error) {
      console.error('Failed to load workflow:', error);
    }
  };

  const handleSave = async () => {
    try {
      if (id) {
        await workflowService.update(id, workflow);
      } else {
        await workflowService.create(workflow);
      }
      navigate('/workflows');
    } catch (error) {
      console.error('Failed to save workflow:', error);
      alert('Failed to save workflow');
    }
  };

  const addStep = () => {
    const newStep = {
      name: '',
      stepOrder: workflow.steps.length + 1,
      type: 'AI_PROCESSING',
      status: 'PENDING',
      aiPrompt: '',
      configuration: '',
    };
    setWorkflow({
      ...workflow,
      steps: [...workflow.steps, newStep],
    });
  };

  const removeStep = (index) => {
    const newSteps = workflow.steps.filter((_, i) => i !== index);
    setWorkflow({ ...workflow, steps: newSteps });
  };

  const updateStep = (index, field, value) => {
    const newSteps = [...workflow.steps];
    newSteps[index] = { ...newSteps[index], [field]: value };
    setWorkflow({ ...workflow, steps: newSteps });
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
        <IconButton onClick={() => navigate('/workflows')} sx={{ mr: 2 }}>
          <ArrowBackIcon />
        </IconButton>
        <Typography variant="h4">
          {id ? 'Edit Workflow' : 'Create Workflow'}
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <TextField
              fullWidth
              label="Workflow Name"
              value={workflow.name}
              onChange={(e) => setWorkflow({ ...workflow, name: e.target.value })}
              sx={{ mb: 2 }}
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="Description"
              value={workflow.description}
              onChange={(e) =>
                setWorkflow({ ...workflow, description: e.target.value })
              }
              sx={{ mb: 2 }}
            />
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={workflow.status}
                label="Status"
                onChange={(e) => setWorkflow({ ...workflow, status: e.target.value })}
              >
                <MenuItem value="DRAFT">Draft</MenuItem>
                <MenuItem value="ACTIVE">Active</MenuItem>
                <MenuItem value="PAUSED">Paused</MenuItem>
              </Select>
            </FormControl>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography variant="h6">Steps</Typography>
              <Button startIcon={<AddIcon />} onClick={addStep} variant="outlined">
                Add Step
              </Button>
            </Box>

            {workflow.steps.map((step, index) => (
              <Paper key={index} sx={{ p: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                  <Typography variant="subtitle1">Step {step.stepOrder}</Typography>
                  <IconButton onClick={() => removeStep(index)} size="small">
                    <DeleteIcon />
                  </IconButton>
                </Box>
                <TextField
                  fullWidth
                  label="Step Name"
                  value={step.name}
                  onChange={(e) => updateStep(index, 'name', e.target.value)}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Step Type</InputLabel>
                  <Select
                    value={step.type}
                    label="Step Type"
                    onChange={(e) => updateStep(index, 'type', e.target.value)}
                  >
                    <MenuItem value="AI_PROCESSING">AI Processing</MenuItem>
                    <MenuItem value="DATA_TRANSFORMATION">Data Transformation</MenuItem>
                    <MenuItem value="NOTIFICATION">Notification</MenuItem>
                    <MenuItem value="CONDITIONAL">Conditional</MenuItem>
                    <MenuItem value="MANUAL_REVIEW">Manual Review</MenuItem>
                  </Select>
                </FormControl>
                {step.type === 'AI_PROCESSING' && (
                  <TextField
                    fullWidth
                    multiline
                    rows={3}
                    label="AI Prompt"
                    value={step.aiPrompt || ''}
                    onChange={(e) => updateStep(index, 'aiPrompt', e.target.value)}
                    sx={{ mb: 2 }}
                  />
                )}
              </Paper>
            ))}
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Button
              fullWidth
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={handleSave}
              sx={{ mb: 2 }}
            >
              Save Workflow
            </Button>
            <Button fullWidth variant="outlined" onClick={() => navigate('/workflows')}>
              Cancel
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

