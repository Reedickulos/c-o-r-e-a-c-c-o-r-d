import React from 'react';
import { Typography } from '@mui/material';
import Analysis from './Analysis';

interface RoundProps {
  roundData: {
    round: number;
    evaluation_metrics: {
      consensus_score: number;
      diversity_score: number;
    };
    analyses: any[];
    compressed_context?: string;
  };
}

const Round: React.FC<RoundProps> = ({ roundData }) => {
  return (
    <div className="round-container mt-8">
      <Typography variant="h5" color="white">Round {roundData.round}</Typography>
      
      <div className="metrics grid grid-cols-2 gap-4 mt-4">
        <div className="metric-card bg-gray-800 p-4 rounded-lg">
            <Typography variant="h6" color="white">Consensus</Typography>
            <Typography variant="h4" color="white">{roundData.evaluation_metrics.consensus_score}</Typography>
        </div>
        <div className="metric-card bg-gray-800 p-4 rounded-lg">
            <Typography variant="h6" color="white">Diversity</Typography>
            <Typography variant="h4" color="white">{roundData.evaluation_metrics.diversity_score}</Typography>
        </div>
      </div>

      {roundData.compressed_context && (
        <div className="compressed-context mt-4">
            <Typography variant="h6" color="white">Compressed Context for this Round</Typography>
            <p className="text-gray-400">{roundData.compressed_context}</p>
        </div>
      )}

      <div className="analyses mt-4">
        {roundData.analyses.map((analysis, i) => (
          <Analysis key={i} analysis={analysis} />
        ))}
      </div>
    </div>
  );
};

export default Round;
