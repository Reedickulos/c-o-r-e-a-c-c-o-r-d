import React, { useState } from 'react';
import axios from 'axios';
import {
  Typography,
  Container,
  CircularProgress,
} from '@mui/material';
import Round from '../components/Round';

const API_BASE_URL = 'https://core-accord.core-accord.workers.dev/api';

const UnifiedApp: React.FC = () => {
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [displayedRounds, setDisplayedRounds] = useState<any[]>([]);

  const handleQueryChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setDisplayedRounds([]);

    try {
        console.log("Starting collaboration...");
        const { data } = await axios.post(`${API_BASE_URL}/collaborate`, { query });
        console.log("Job started:", data);
        const { jobId } = data;
        pollStatus(jobId);
    } catch (err) {
        setError('An error occurred while starting the collaboration.');
        setLoading(false);
    }
  };

  const pollStatus = (jobId: string) => {
    const intervalId = setInterval(async () => {
        try {
            console.log("Polling for status of job:", jobId);
            const { data } = await axios.get(`${API_BASE_URL}/status/${jobId}`);
            console.log("Status response:", data);
            setResponse(data);
            setDisplayedRounds(data.audit_trail);

            if (data.status === 'complete') {
                clearInterval(intervalId);
                setLoading(false);
            }
        } catch (err) {
            setError('An error occurred while polling for status.');
            clearInterval(intervalId);
            setLoading(false);
        }
    }, 3000); // Poll every 3 seconds
  };

  return (
    <div className="bg-background-light dark:bg-background-dark font-display text-gray-900 dark:text-gray-100">
<div className="flex min-h-screen w-full flex-col">
<header className="sticky top-0 z-50 w-full border-b border-primary/20 dark:border-primary/20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm">
<div className="container mx-auto flex items-center justify-between px-4 sm:px-6 lg:px-8 py-3">
<div className="flex items-center gap-3">
<svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
<path d="M4 4H17.3334V17.3334H30.6666V30.6666H44V44H4V4Z" fill="currentColor"></path>
</svg>
<h2 className="text-lg font-bold text-gray-900 dark:text-white">Core Accord</h2>
</div>
<nav className="hidden md:flex items-center gap-8">
<a className="text-sm font-medium hover:text-primary" href="#">Product</a>
<a className="text-sm font-medium hover:text-primary" href="#">Pricing</a>
<a className="text-sm font-medium hover:text-primary" href="#">Resources</a>
</nav>
<div className="flex items-center gap-2">
<button className="rounded-lg h-10 px-4 text-sm font-bold bg-primary/20 text-primary hover:bg-primary/30">
              Log In
            </button>
<button className="rounded-lg h-10 px-4 bg-primary text-background-dark text-sm font-bold hover:opacity-90">
              Try for Free
            </button>
</div>
</div>
</header>
<main className="flex-grow">
<section className="relative flex flex-col items-center justify-center py-24 sm:py-32 md:py-40 bg-cover bg-center" style={{backgroundImage: 'linear-gradient(rgba(16, 34, 16, 0.7) 0%, rgba(16, 34, 16, 0.9) 100%), url("https://lh3.googleusercontent.com/aida-public/AB6AXuDIXf0alBQ_t5_hUmDngCUtH5Lx5AXTJ3uCHMTAEEAZxCKEP0JOHN_3qb71J3pYC8-DfXqi8YkEZ3ZJSALilRt1xp3LTLxk2eu5OEiYqsYlkxPp6b4Xv_MK-nVUuy8EFZMfU-nAsyQBx1yVml7-pwn21J1qChw8I9Cd3jelHvroHyCHX_jnhIY820MyR6_89dY9ECM4nTaEEzVI0f2aymQcBkAE548gE9tjMd_37LCl7iQxbs9k3un_swBEdji43O7zNqNx_LAuPTkz")'}}>
<div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
<h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white tracking-tighter">
              What critical decision are you facing today?
            </h1>
<div className="mt-8 max-w-2xl mx-auto">
<div className="relative">
<input className="form-input w-full rounded-lg h-16 pl-6 pr-48 text-base bg-white/10 dark:bg-black/20 text-white placeholder-gray-400 border border-primary/30 focus:border-primary focus:ring-primary" placeholder="Enter your decision question here" value={query} onChange={handleQueryChange} />
<button className="absolute inset-y-0 right-2 my-2 flex items-center justify-center rounded-lg px-5 bg-primary text-background-dark text-sm font-bold hover:opacity-90" onClick={handleSubmit} disabled={loading}>
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Analyze →'}
                </button>
</div>
</div>
<p className="mt-6 max-w-3xl mx-auto text-base text-gray-300">
              Get analysis from 5 diverse AI models in 30 seconds - See where they agree (consensus) - Discover what each uniquely contributes (diversity) - Save
              <span className="font-bold text-primary">80% on AI costs</span> vs. consulting multiple models separately.
            </p>
</div>
</section>
{loading && <Typography color="white">Status: {response ? response.status : 'Starting...'}</Typography>}
{response && (
        <section className="py-16 sm:py-24 bg-gray-900">
            <Container sx={{maxWidth: 'lg'}}>
                {response.status === 'complete' && <Typography variant="h4" color="white">{response.conclusion}</Typography>}
                
                <div id="audit-trail">
                    {displayedRounds.map((roundData: any, index: number) => (
                        <Round key={index} roundData={roundData} />
                    ))}
                </div>
            </Container>
        </section>
    )}
</main>
</div>
</div>
  );
};

export default UnifiedApp;
