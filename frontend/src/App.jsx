import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { Toaster } from 'react-hot-toast';
import { LanguageProvider } from './contexts/LanguageContext.jsx';
import Dashboard from './pages/Dashboard';
import RegionDetail from './pages/RegionDetail';
import GenderStatistics from './pages/GenderStatistics';
import RegionComp from './components/RegionComp';
import MunicipalComp from './pages/MunicipalComp';
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
            <Toaster position="top-right" reverseOrder={false} />
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
              
              {/* Region comparison routes */}
              <Route path="/ge/region-comparison" element={<RegionComp />} />
              <Route path="/en/region-comparison" element={<RegionComp />} />

              {/* Municipal comparison routes */}
              <Route path="/ge/municipal-comparison" element={<MunicipalComp />} />
              <Route path="/en/municipal-comparison" element={<MunicipalComp />} />

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
