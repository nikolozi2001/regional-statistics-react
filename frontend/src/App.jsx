import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import Dashboard from './pages/Dashboard';
import RegionDetail from './pages/RegionDetail';
import GenderStatistics from './pages/GenderStatistics';
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
              
              {/* Region detail routes */}
              <Route path="/ge/region/:id" element={<RegionDetail />} />
              <Route path="/en/region/:id" element={<RegionDetail />} />
              
              {/* Gender statistics routes */}
              <Route path="/ge/gender-statistics" element={<GenderStatistics />} />
              <Route path="/en/gender-statistics" element={<GenderStatistics />} />
              <Route path="/ge/gender-statistics/:regionId" element={<GenderStatistics />} />
              <Route path="/en/gender-statistics/:regionId" element={<GenderStatistics />} />
              
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
