import React from 'react';
import CircularProgress from '@mui/material/CircularProgress';

const LoadingComponent = () => (
  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
    <CircularProgress size={80} color="inherit" style={{ color: 'white' }} /> {/* Adjusted size and color */}
  </div>
);

export default LoadingComponent;
