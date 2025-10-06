import React from 'react';
import { Typography, Card, CardContent } from '@mui/material';

interface AnalysisProps {
  analysis: {
    analysis_id: string;
    content: string;
    tokens: number;
    response_time_ms: number;
    success: boolean;
  };
}

const Analysis: React.FC<AnalysisProps> = ({ analysis }) => {
  return (
    <Card sx={{ mt: 2, backgroundColor: analysis.success ? '#1e293b' : '#3e292b' }}>
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" color="white">
          {analysis.analysis_id}
        </Typography>
        <Typography variant="body2" color="gray" sx={{ mb: 1 }}>
          Tokens: {analysis.tokens} | Time: {analysis.response_time_ms}ms | Success: {analysis.success ? 'Yes' : 'No'}
        </Typography>
        <Typography color="white">{analysis.content}</Typography>
      </CardContent>
    </Card>
  );
};

export default Analysis;
