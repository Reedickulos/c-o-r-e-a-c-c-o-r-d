import React from 'react';
import { useNavigate } from 'react-router-dom';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleAnalyze = () => {
    // Later, we will pass the query to the app page
    navigate('/app');
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
                  <input className="form-input w-full rounded-lg h-16 pl-6 pr-48 text-base bg-surface-dark text-text-dark placeholder-text-muted-dark border border-gray-600 focus:border-primary-light focus:ring-primary-light" placeholder="Enter your decision question here"/>
                  <button onClick={handleAnalyze} className="absolute inset-y-0 right-2 my-2 flex items-center justify-center rounded-lg px-5 bg-primary text-white text-sm font-bold hover:bg-primary-light">
                    Analyze →
                  </button>
                </div>
              </div>
              <p className="mt-6 max-w-3xl mx-auto text-base text-text-muted-dark">
                Get analysis from 5 diverse AI models in 30 seconds - See where they agree (consensus) - Discover what each uniquely contributes (diversity) - Save
                <span className="font-bold text-secondary">80% on AI costs</span> vs. consulting multiple models separately.
              </p>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default LandingPage;