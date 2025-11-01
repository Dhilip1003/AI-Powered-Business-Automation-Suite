import React, { useState, useEffect } from 'react';
import { Grid, Paper, Typography, Box, Card, CardContent } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import Button from '@mui/material/Button';
import { workflowService } from '../services/api';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalWorkflows: 0,
    activeWorkflows: 0,
    totalExecutions: 0,
    successRate: 0,
  });
  const [recentExecutions, setRecentExecutions] = useState([]);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      const response = await workflowService.getAll();
      const workflows = response.data;
      
      setStats({
        totalWorkflows: workflows.length,
        activeWorkflows: workflows.filter(w => w.status === 'ACTIVE').length,
        totalExecutions: 0, // Would be calculated from executions
        successRate: 95, // Placeholder
      });
    } catch (error) {
      console.error('Failed to load dashboard data:', error);
    }
  };

  const sampleData = [
    { name: 'Mon', executions: 12, success: 11 },
    { name: 'Tue', executions: 19, success: 18 },
    { name: 'Wed', executions: 15, success: 14 },
    { name: 'Thu', executions: 22, success: 21 },
    { name: 'Fri', executions: 18, success: 17 },
    { name: 'Sat', executions: 8, success: 8 },
    { name: 'Sun', executions: 5, success: 5 },
  ];

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>

      <Grid container spacing={3} sx={{ mt: 2 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Workflows
              </Typography>
              <Typography variant="h4">{stats.totalWorkflows}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Active Workflows
              </Typography>
              <Typography variant="h4">{stats.activeWorkflows}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total Executions
              </Typography>
              <Typography variant="h4">{stats.totalExecutions}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Success Rate
              </Typography>
              <Typography variant="h4">{stats.successRate}%</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Execution Trends
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={sampleData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="executions" stroke="#8884d8" />
                <Line type="monotone" dataKey="success" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Quick Actions
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <Button
                variant="contained"
                fullWidth
                onClick={() => navigate('/workflows/new')}
              >
                Create New Workflow
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/workflows')}
              >
                View All Workflows
              </Button>
              <Button
                variant="outlined"
                fullWidth
                onClick={() => navigate('/ai-playground')}
              >
                AI Playground
              </Button>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}

