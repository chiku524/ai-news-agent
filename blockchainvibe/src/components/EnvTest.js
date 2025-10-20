import React from 'react';

const EnvTest = () => {
  return (
    <div style={{ 
      position: 'fixed', 
      top: '10px', 
      right: '10px', 
      background: 'white', 
      border: '2px solid red', 
      padding: '10px', 
      zIndex: 9999,
      fontSize: '12px',
      maxWidth: '300px'
    }}>
      <h4>Environment Test</h4>
      <p><strong>REACT_APP_REDIRECT_URI:</strong> {process.env.REACT_APP_REDIRECT_URI}</p>
      <p><strong>REACT_APP_API_URL:</strong> {process.env.REACT_APP_API_URL}</p>
      <p><strong>NODE_ENV:</strong> {process.env.NODE_ENV}</p>
    </div>
  );
};

export default EnvTest;
