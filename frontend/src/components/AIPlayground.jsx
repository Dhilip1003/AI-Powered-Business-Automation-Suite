import React, { useState } from 'react';
import {
  Box,
  Typography,
  Paper,
  TextField,
  Button,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
} from '@mui/material';
import { aiService } from '../services/api';

function TabPanel({ children, value, index }) {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function AIPlayground() {
  const [tabValue, setTabValue] = useState(0);
  const [prompt, setPrompt] = useState('');
  const [context, setContext] = useState('{}');
  const [aiResult, setAiResult] = useState('');
  const [loading, setLoading] = useState(false);

  const [analyzeData, setAnalyzeData] = useState('');
  const [analysisType, setAnalysisType] = useState('general');
  const [analysisResult, setAnalysisResult] = useState('');

  const [scenario, setScenario] = useState('');
  const [parameters, setParameters] = useState('{}');
  const [decisionResult, setDecisionResult] = useState('');

  const handleProcess = async () => {
    setLoading(true);
    try {
      const contextObj = JSON.parse(context);
      const response = await aiService.process(prompt, contextObj);
      setAiResult(response.data.result);
    } catch (error) {
      console.error('Failed to process:', error);
      setAiResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const response = await aiService.analyze(analyzeData, analysisType);
      setAnalysisResult(JSON.stringify(response.data, null, 2));
    } catch (error) {
      console.error('Failed to analyze:', error);
      setAnalysisResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDecision = async () => {
    setLoading(true);
    try {
      const paramsObj = JSON.parse(parameters);
      const response = await aiService.generateDecision(scenario, paramsObj);
      setDecisionResult(response.data.decision);
    } catch (error) {
      console.error('Failed to generate decision:', error);
      setDecisionResult('Error: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        AI Playground
      </Typography>

      <Paper sx={{ mt: 3 }}>
        <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
          <Tab label="AI Processing" />
          <Tab label="Data Analysis" />
          <Tab label="Decision Generation" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={6}
                label="Prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Context (JSON)"
                value={context}
                onChange={(e) => setContext(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleProcess}
                disabled={loading || !prompt}
              >
                {loading ? <CircularProgress size={24} /> : 'Process'}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={12}
                label="Result"
                value={aiResult}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                select
                label="Analysis Type"
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                SelectProps={{
                  native: true,
                }}
                sx={{ mb: 2 }}
              >
                <option value="general">General</option>
                <option value="financial">Financial</option>
                <option value="performance">Performance</option>
                <option value="risk">Risk Assessment</option>
              </TextField>
              <TextField
                fullWidth
                multiline
                rows={8}
                label="Data to Analyze"
                value={analyzeData}
                onChange={(e) => setAnalyzeData(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleAnalyze}
                disabled={loading || !analyzeData}
              >
                {loading ? <CircularProgress size={24} /> : 'Analyze'}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={12}
                label="Analysis Result"
                value={analysisResult}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Scenario"
                value={scenario}
                onChange={(e) => setScenario(e.target.value)}
                sx={{ mb: 2 }}
              />
              <TextField
                fullWidth
                multiline
                rows={4}
                label="Parameters (JSON)"
                value={parameters}
                onChange={(e) => setParameters(e.target.value)}
                sx={{ mb: 2 }}
              />
              <Button
                variant="contained"
                onClick={handleDecision}
                disabled={loading || !scenario}
              >
                {loading ? <CircularProgress size={24} /> : 'Generate Decision'}
              </Button>
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                multiline
                rows={12}
                label="Decision Result"
                value={decisionResult}
                InputProps={{
                  readOnly: true,
                }}
              />
            </Grid>
          </Grid>
        </TabPanel>
      </Paper>
    </Box>
  );
}

