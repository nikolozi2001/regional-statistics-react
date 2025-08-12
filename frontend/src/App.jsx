import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import Dashboard from './pages/Dashboard';
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <LanguageProvider>
          <div className="App">
            <Routes>
              {/* Default redirect to Georgian */}
              <Route path="/" element={<Navigate to="/ge" replace />} />
              
              {/* Language-specific routes */}
              <Route path="/ge" element={<Dashboard />} />
              <Route path="/en" element={<Dashboard />} />
              
              {/* Catch all other routes and redirect to Georgian */}
              <Route path="*" element={<Navigate to="/ge" replace />} />
            </Routes>
          </div>
        </LanguageProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
