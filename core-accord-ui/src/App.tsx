import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  CircularProgress,
  Card,
  CardContent,
  Grid as GridLegacy,
  Box,
} from '@mui/material';
import axios from 'axios';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';

const API_URL = 'https://core-accord.core-accord.workers.dev/api/collaborate';

function MainApp() {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);

    try {
      const result = await axios.post(API_URL, { query });
      setResponse(result.data);
    } catch (err) {
      setError('An error occurred while fetching the data.');
    } finally {
      setLoading(false);
    }
  };

  const handleExportJson = () => {
    if (response) {
      const json = JSON.stringify(response, null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'core-accord-report.json';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportMarkdown = () => {
    if (response) {
      let markdown = `# CORE ACCORD Report\n\n`;
      markdown += `## Query\n\n${response.query}\n\n`;
      markdown += `## Evaluation Metrics\n\n`;
      markdown += `- **Consensus Score:** ${response.evaluation_metrics.consensus_score}\n`;
      markdown += `- **Diversity Score:** ${response.evaluation_metrics.diversity_score}\n`;
      markdown += `- **Complementarity Score:** ${response.evaluation_metrics.complementarity_score}\n\n`;
      markdown += `## Analyses\n\n`;
      response.analyses.forEach((analysis: any) => {
        markdown += `### ${analysis.analysis_id}\n\n`;
        markdown += `${analysis.content}\n\n`;
      });
      const blob = new Blob([markdown], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'core-accord-report.md';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  const handleExportCsv = () => {
    if (response) {
      let csv = 'analysis_id,content,tokens,response_time_ms,success\n';
      response.analyses.forEach((analysis: any) => {
        const escapedContent = analysis.content.replace(/\n/g, '\\n').replace(/"/g, '""');
        csv += `"${analysis.analysis_id}","${escapedContent}","${analysis.token_count}","${analysis.response_time_ms}","${analysis.success}"\n`;
      });
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'core-accord-report.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            CORE ACCORD
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Card>
          <CardContent>
            <Typography variant="h5" component="h2" gutterBottom>
              Collaborative Analysis Query
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={4}
              variant="outlined"
              label="Enter your query"
              value={query}
              onChange={handleQueryChange}
              sx={{ mb: 2 }}
            />
            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmit}
              disabled={loading || !query}
            >
              {loading ? <CircularProgress size={24} /> : 'Submit Query'}
            </Button>
          </CardContent>
        </Card>

        {error && (
          <Card sx={{ mt: 2, bgcolor: '#ffebee' }}>
            <CardContent>
              <Typography color="error">{error}</Typography>
            </CardContent>
          </Card>
        )}

        {response && (
          <Card sx={{ mt: 2 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Results
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Button variant="outlined" onClick={handleExportJson} sx={{ mr: 1 }}>
                  Export JSON
                </Button>
                <Button variant="outlined" onClick={handleExportMarkdown} sx={{ mr: 1 }}>
                  Export Markdown
                </Button>
                <Button variant="outlined" onClick={handleExportCsv}>
                  Export CSV
                </Button>
              </Box>
              <Typography variant="subtitle1" gutterBottom>
                Query: {response.query}
              </Typography>
              <Typography variant="subtitle2" gutterBottom>
                Evaluation Metrics:
              </Typography>
              <GridLegacy container spacing={2}>
                <GridLegacy item xs={12} md={4}>
                  <Typography>Consensus: {response.evaluation_metrics.consensus_score}</Typography>
                </GridLegacy>
                <GridLegacy item xs={12} md={4}>
                  <Typography>Diversity: {response.evaluation_metrics.diversity_score}</Typography>
                </GridLegacy>
                <GridLegacy item xs={12} md={4}>
                  <Typography>Complementarity: {response.evaluation_metrics.complementarity_score}</Typography>
                </GridLegacy>
              </GridLegacy>
            </CardContent>
          </Card>
        )}
      </Container>
    </Box>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/app" element={<MainApp />} />
    </Routes>
  );
}

export default App;
