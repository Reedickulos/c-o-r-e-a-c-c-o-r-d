import React, { useState } from 'react';
import axios from 'axios';
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
  Grid,
  Box,
  Chip,
} from '@mui/material';

const API_URL = 'https://core-accord.core-accord.workers.dev/api/collaborate';

const UnifiedApp: React.FC = () => {
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

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-text-light dark:text-text-dark">
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-gray-700 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
            <div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-200 dark:bg-gray-700">
                        <p className="text-xs font-bold text-text-muted-light dark:text-text-muted-dark text-center leading-tight">Logo</p>
                    </div>
                    <h2 className="text-lg font-bold text-text-light dark:text-text-dark">Core Accord</h2>
                </div>
                <nav className="hidden md:flex items-center gap-8">
                    <a className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary-light" href="#">Product</a>
                    <a className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary-light" href="#">Pricing</a>
                    <a className="text-sm font-medium text-text-muted-light dark:text-text-muted-dark hover:text-primary-light" href="#">Resources</a>
                </nav>
                <div className="flex items-center gap-2">
                    <button className="rounded-lg h-10 px-4 text-sm font-bold bg-primary-light/10 text-primary-light hover:bg-primary-light/20">
                        Log In
                    </button>
                    <button className="rounded-lg h-10 px-4 bg-primary text-white text-sm font-bold hover:bg-primary-light">
                        Try for Free
                    </button>
                </div>
            </div>
        </header>
        <main className="flex-grow">
            <section className="relative flex flex-col items-center justify-center py-24 sm:py-32 md:py-40 bg-background-dark">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-text-dark tracking-tighter">
                        What critical decision are you facing today?
                    </h1>
                    <div className="mt-8 max-w-2xl mx-auto">
                        <div className="relative">
                            <input 
                                value={query} 
                                onChange={handleQueryChange} 
                                className="form-input w-full rounded-lg h-16 pl-6 pr-48 text-base bg-surface-dark text-text-dark placeholder-text-muted-dark border border-gray-600 focus:border-primary-light focus:ring-primary-light" 
                                placeholder="Enter your decision question here"/>
                            <button onClick={handleSubmit} disabled={loading} className="absolute inset-y-0 right-2 my-2 flex items-center justify-center rounded-lg px-5 bg-primary text-white text-sm font-bold hover:bg-primary-light disabled:bg-gray-500">
                                {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze →'}
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- RESULTS SECTION --- */}
            <section className="py-16 sm:py-24 bg-background-light dark:bg-surface-dark">
                <Container sx={{maxWidth: 'lg'}}>
                    {error && (
                        <Typography color="error" sx={{ mb: 2, textAlign: 'center' }}>
                            {error}
                        </Typography>
                    )}
                    {response && (
                        <Grid container spacing={2} sx={{ mt: 2 }}>
                            {/* --- METRICS --- */}
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Evaluation Metrics</Typography>
                                        <Typography>Consensus: {response.evaluation_metrics.consensus_score}</Typography>
                                        <Typography>Diversity: {response.evaluation_metrics.diversity_score}</Typography>
                                        <Typography>Complementarity: {response.evaluation_metrics.complementarity_score}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Token Efficiency</Typography>
                                        <Typography>Savings: {response.token_efficiency.savings_percentage}%</Typography>
                                        <Typography>CORE ACCORD Tokens: {response.token_efficiency.core_accord_tokens}</Typography>
                                        <Typography>Naive Approach: {response.token_efficiency.naive_approach_tokens}</Typography>
                                        <Typography>Cost (CORE): ${response.token_efficiency.cost_core_accord}</Typography>
                                        <Typography>Cost (Naive): ${response.token_efficiency.cost_naive}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6">Metadata</Typography>
                                        <Typography>Total Time: {response.metadata.total_time_ms}ms</Typography>
                                        <Typography>Total Tokens: {response.metadata.total_tokens}</Typography>
                                        <Typography>Success: {response.metadata.analyses_completed}/{response.metadata.analyses_completed + response.metadata.analyses_failed}</Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* --- FINDINGS --- */}
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>Key Agreements</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {response.evaluation_metrics.key_agreements.map((item: string) => (
                                                <Chip label={item} key={item} color="success" variant="outlined" />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <Card>
                                    <CardContent>
                                        <Typography variant="h6" gutterBottom>Key Disagreements</Typography>
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                            {response.evaluation_metrics.key_disagreements.map((item: string) => (
                                                <Chip label={item} key={item} color="warning" variant="outlined" />
                                            ))}
                                        </Box>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* --- ANALYSES --- */}
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ mt: 4, mb: 2 }}>
                                    Individual Analyses
                                </Typography>
                                {response.analyses.map((analysis: any) => (
                                    <Card key={analysis.analysis_id} sx={{ mt: 2 }}>
                                        <CardContent>
                                            <Typography variant="subtitle1" fontWeight="bold">
                                                {analysis.analysis_id}
                                            </Typography>
                                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                                Tokens: {analysis.tokens} | Time: {analysis.response_time_ms}ms | Success: {analysis.success ? 'Yes' : 'No'}
                                            </Typography>
                                            <Typography>{analysis.content}</Typography>
                                        </CardContent>
                                    </Card>
                                ))}
                            </Grid>
                        </Grid>
                    )}
                </Container>
            </section>
        </main>
      </div>
    </div>
  );
};

export default UnifiedApp;
