import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Container,
  TextField,
  Button,
  CircularProgress,
  Box,
  Paper,
} from '@mui/material';
import axios from 'axios';

const API_URL = 'https://core-accord.core-accord.workers.dev/api/collaborate';

function QueryPage() {
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
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#101922' }}>
      <AppBar position="static" sx={{ bgcolor: '#101922', borderBottom: '1px solid rgba(246, 247, 248, 0.1)' }}>
        <Toolbar sx={{ px: { xs: 2, sm: 6, md: 10 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flexGrow: 1 }}>
            <Box sx={{ width: 24, height: 24, color: '#1173d4' }}>
              <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
                <path d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z" fill="currentColor"></path>
              </svg>
            </Box>
            <Typography variant="h6" sx={{ fontWeight: 700, fontSize: '1.125rem', color: '#f6f7f8' }}>
              CORE ACCORD
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 3 }}>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: '#1173d4', cursor: 'pointer' }}>
              Dashboard
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(246, 247, 248, 0.6)', cursor: 'pointer', '&:hover': { color: '#1173d4' } }}>
              Queries
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(246, 247, 248, 0.6)', cursor: 'pointer', '&:hover': { color: '#1173d4' } }}>
              Agents
            </Typography>
            <Typography sx={{ fontSize: '0.875rem', fontWeight: 500, color: 'rgba(246, 247, 248, 0.6)', cursor: 'pointer', '&:hover': { color: '#1173d4' } }}>
              Settings
            </Typography>
          </Box>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ py: { xs: 4, sm: 6, md: 8 }, flexGrow: 1 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontWeight: 700, color: '#f6f7f8', mb: 1 }}>
            Collaborative Intelligence Analysis
          </Typography>
          <Typography sx={{ color: 'rgba(246, 247, 248, 0.6)' }}>
            Submit your query to get analysis from multiple AI perspectives.
          </Typography>
        </Box>

        <Paper sx={{ bgcolor: '#101922', border: '1px solid rgba(246, 247, 248, 0.1)', borderRadius: 2, p: 3, mb: 3 }}>
          <TextField
            fullWidth
            multiline
            rows={6}
            variant="outlined"
            label="Enter your query"
            value={query}
            onChange={handleQueryChange}
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                color: '#f6f7f8',
                '& fieldset': {
                  borderColor: 'rgba(246, 247, 248, 0.2)',
                },
                '&:hover fieldset': {
                  borderColor: 'rgba(246, 247, 248, 0.3)',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#1173d4',
                },
              },
              '& .MuiInputLabel-root': {
                color: 'rgba(246, 247, 248, 0.6)',
              },
            }}
          />
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={loading || !query}
            sx={{
              bgcolor: '#1173d4',
              color: '#fff',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              '&:hover': {
                bgcolor: '#0d5aa8',
              },
              '&:disabled': {
                bgcolor: 'rgba(17, 115, 212, 0.3)',
                color: 'rgba(246, 247, 248, 0.3)',
              },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Submit Query'}
          </Button>
        </Paper>

        {error && (
          <Paper sx={{ bgcolor: '#ffebee', border: '1px solid #ef5350', borderRadius: 2, p: 3, mb: 3 }}>
            <Typography sx={{ color: '#c62828' }}>{error}</Typography>
          </Paper>
        )}

        {response && (
          <Box>
            <Paper sx={{ bgcolor: '#101922', border: '1px solid rgba(246, 247, 248, 0.1)', borderRadius: 2, p: 3, mb: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 600, color: '#f6f7f8' }}>
                  Analysis Results
                </Typography>
                <Box sx={{ display: 'flex', gap: 1 }}>
                  <Button
                    variant="outlined"
                    onClick={handleExportJson}
                    sx={{
                      color: '#1173d4',
                      borderColor: '#1173d4',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: '#0d5aa8',
                        bgcolor: 'rgba(17, 115, 212, 0.1)',
                      },
                    }}
                  >
                    Export JSON
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleExportMarkdown}
                    sx={{
                      color: '#1173d4',
                      borderColor: '#1173d4',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: '#0d5aa8',
                        bgcolor: 'rgba(17, 115, 212, 0.1)',
                      },
                    }}
                  >
                    Export Markdown
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={handleExportCsv}
                    sx={{
                      color: '#1173d4',
                      borderColor: '#1173d4',
                      fontSize: '0.875rem',
                      '&:hover': {
                        borderColor: '#0d5aa8',
                        bgcolor: 'rgba(17, 115, 212, 0.1)',
                      },
                    }}
                  >
                    Export CSV
                  </Button>
                </Box>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" sx={{ color: 'rgba(246, 247, 248, 0.6)', mb: 1 }}>
                  Query
                </Typography>
                <Typography sx={{ color: '#f6f7f8', mb: 3 }}>
                  {response.query}
                </Typography>

                <Typography variant="h6" sx={{ color: '#f6f7f8', mb: 2 }}>
                  Evaluation Metrics
                </Typography>
                <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 3 }}>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', color: 'rgba(246, 247, 248, 0.6)', mb: 0.5 }}>
                      Consensus Score
                    </Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#1173d4' }}>
                      {response.evaluation_metrics.consensus_score}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', color: 'rgba(246, 247, 248, 0.6)', mb: 0.5 }}>
                      Diversity Score
                    </Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#1173d4' }}>
                      {response.evaluation_metrics.diversity_score}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: '0.875rem', color: 'rgba(246, 247, 248, 0.6)', mb: 0.5 }}>
                      Complementarity Score
                    </Typography>
                    <Typography sx={{ fontSize: '1.5rem', fontWeight: 700, color: '#1173d4' }}>
                      {response.evaluation_metrics.complementarity_score}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Paper>

            <Typography variant="h6" sx={{ color: '#f6f7f8', mb: 2, fontWeight: 600 }}>
              Individual Analyses
            </Typography>
            {response.analyses.map((analysis: any, index: number) => (
              <Paper
                key={analysis.analysis_id || index}
                sx={{
                  bgcolor: '#101922',
                  border: '1px solid rgba(246, 247, 248, 0.1)',
                  borderRadius: 2,
                  p: 3,
                  mb: 2,
                }}
              >
                <Typography variant="subtitle1" sx={{ color: '#1173d4', fontWeight: 600, mb: 1 }}>
                  {analysis.analysis_id}
                </Typography>
                <Typography sx={{ color: '#f6f7f8', whiteSpace: 'pre-wrap' }}>
                  {analysis.content}
                </Typography>
              </Paper>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
}

export default QueryPage;
