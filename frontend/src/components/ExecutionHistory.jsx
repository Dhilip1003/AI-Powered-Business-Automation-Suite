import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import { workflowService } from '../services/api';

export default function ExecutionHistory() {
  const [workflows, setWorkflows] = useState([]);
  const [selectedWorkflow, setSelectedWorkflow] = useState('');
  const [executions, setExecutions] = useState([]);

  useEffect(() => {
    loadWorkflows();
  }, []);

  useEffect(() => {
    if (selectedWorkflow) {
      loadExecutions();
    }
  }, [selectedWorkflow]);

  const loadWorkflows = async () => {
    try {
      const response = await workflowService.getAll();
      setWorkflows(response.data);
      if (response.data.length > 0) {
        setSelectedWorkflow(response.data[0].id.toString());
      }
    } catch (error) {
      console.error('Failed to load workflows:', error);
    }
  };

  const loadExecutions = async () => {
    try {
      const response = await workflowService.getExecutions(selectedWorkflow);
      setExecutions(response.data);
    } catch (error) {
      console.error('Failed to load executions:', error);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      COMPLETED: 'success',
      RUNNING: 'info',
      FAILED: 'error',
      CANCELLED: 'default',
    };
    return colors[status] || 'default';
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Execution History
      </Typography>

      <FormControl sx={{ minWidth: 200, mb: 3 }}>
        <InputLabel>Select Workflow</InputLabel>
        <Select
          value={selectedWorkflow}
          label="Select Workflow"
          onChange={(e) => setSelectedWorkflow(e.target.value)}
        >
          {workflows.map((workflow) => (
            <MenuItem key={workflow.id} value={workflow.id.toString()}>
              {workflow.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Execution ID</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Started At</TableCell>
              <TableCell>Completed At</TableCell>
              <TableCell>Execution Time</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {executions.map((execution) => (
              <TableRow key={execution.id}>
                <TableCell>{execution.id}</TableCell>
                <TableCell>
                  <Chip
                    label={execution.status}
                    color={getStatusColor(execution.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>
                  {execution.startedAt
                    ? new Date(execution.startedAt).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {execution.completedAt
                    ? new Date(execution.completedAt).toLocaleString()
                    : '-'}
                </TableCell>
                <TableCell>
                  {execution.executionTimeMs
                    ? `${execution.executionTimeMs} ms`
                    : '-'}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

