import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import EditIcon from '@mui/icons-material/Edit';
import { workflowService } from '../services/api';

export default function WorkflowList() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [executeDialog, setExecuteDialog] = useState({ open: false, workflowId: null });
  const [inputData, setInputData] = useState('{}');

  useEffect(() => {
    loadWorkflows();
  }, []);

  const loadWorkflows = async () => {
    try {
      const response = await workflowService.getAll();
      setWorkflows(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Failed to load workflows:', error);
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this workflow?')) {
      try {
        await workflowService.delete(id);
        loadWorkflows();
      } catch (error) {
        console.error('Failed to delete workflow:', error);
      }
    }
  };

  const handleExecute = async () => {
    try {
      const data = JSON.parse(inputData);
      await workflowService.execute(executeDialog.workflowId, data);
      setExecuteDialog({ open: false, workflowId: null });
      alert('Workflow execution started!');
    } catch (error) {
      console.error('Failed to execute workflow:', error);
      alert('Failed to execute workflow. Please check the input data format.');
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      ACTIVE: 'success',
      DRAFT: 'default',
      PAUSED: 'warning',
      COMPLETED: 'info',
      FAILED: 'error',
    };
    return colors[status] || 'default';
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4">Workflows</Typography>
        <Button
          variant="contained"
          onClick={() => navigate('/workflows/new')}
        >
          Create Workflow
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Last Executed</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {workflows.map((workflow) => (
              <TableRow key={workflow.id}>
                <TableCell>{workflow.name}</TableCell>
                <TableCell>{workflow.description || '-'}</TableCell>
                <TableCell>
                  <Chip
                    label={workflow.status}
                    color={getStatusColor(workflow.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {workflow.lastExecutedAt
                    ? new Date(workflow.lastExecutedAt).toLocaleString()
                    : 'Never'}
                </TableCell>
                <TableCell>
                  <IconButton
                    size="small"
                    onClick={() => navigate(`/workflows/${workflow.id}`)}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() =>
                      setExecuteDialog({ open: true, workflowId: workflow.id })
                    }
                  >
                    <PlayArrowIcon />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => handleDelete(workflow.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog
        open={executeDialog.open}
        onClose={() => setExecuteDialog({ open: false, workflowId: null })}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Execute Workflow</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            multiline
            rows={6}
            label="Input Data (JSON)"
            value={inputData}
            onChange={(e) => setInputData(e.target.value)}
            sx={{ mt: 2 }}
            placeholder='{"key": "value"}'
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setExecuteDialog({ open: false, workflowId: null })}>
            Cancel
          </Button>
          <Button onClick={handleExecute} variant="contained">
            Execute
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

