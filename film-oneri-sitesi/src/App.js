import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import Background from './components/Background';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetail from './pages/MovieDetail';
import Favorites from './pages/Favorites';
import Login from './pages/Login';
import Register from './pages/Register';
import { AuthProvider } from './contexts/AuthContext';

// Global stil tanımlamaları
const GlobalStyles = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    margin: 0;
    padding: 0;
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    min-height: 100vh;
    overflow-x: hidden;
  }

  /* Scrollbar stilleri */
  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: rgba(0, 0, 0, 0.2);
  }

  ::-webkit-scrollbar-thumb {
    background: ${({ theme }) => theme.colors.primary};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${({ theme }) => theme.colors.primaryDark};
  }
`;

export const theme = {
  colors: {
    // Ana renkler
    primary: '#6366F1',
    primaryLight: '#818CF8',
    primaryDark: '#4F46E5',
    
    // İkincil renkler
    secondary: '#EC4899',
    secondaryLight: '#F472B6',
    secondaryDark: '#DB2777',
    
    // Arka plan renkleri
    background: '#0F172A',
    surface: '#1E293B',
    surfaceLight: '#334155',
    
    // Metin renkleri
    text: {
      primary: '#F8FAFC',
      secondary: '#CBD5E1',
      light: '#94A3B8'
    },
    
    // Vurgu renkleri
    accent: {
      purple: '#A855F7',
      blue: '#3B82F6',
      green: '#10B981',
      yellow: '#F59E0B',
      red: '#EF4444'
    },
    
    // Gradyan renkler
    gradients: {
      primary: 'linear-gradient(135deg, #6366F1 0%, #818CF8 100%)',
      secondary: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
      glass: 'linear-gradient(135deg, rgba(30, 41, 59, 0.7) 0%, rgba(30, 41, 59, 0.3) 100%)',
      dark: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, #0F172A 100%)'
    }
  },
  
  shadows: {
    small: '0 2px 4px rgba(0, 0, 0, 0.3)',
    medium: '0 4px 6px rgba(0, 0, 0, 0.4)',
    large: '0 10px 15px rgba(0, 0, 0, 0.5)',
    glow: '0 0 20px rgba(99, 102, 241, 0.3)',
    neon: '0 0 10px rgba(236, 72, 153, 0.5)'
  },
  
  blur: {
    default: 'blur(8px)',
    strong: 'blur(16px)'
  },
  
  transitions: {
    fast: '0.2s ease',
    default: '0.3s ease',
    slow: '0.5s ease'
  },
  
  borderRadius: {
    small: '8px',
    default: '12px',
    large: '20px',
    full: '9999px'
  },
  
  breakpoints: {
    mobile: '480px',
    tablet: '768px',
    desktop: '1024px',
    wide: '1280px'
  }
};

const AppContainer = styled.div`
  min-height: 100vh;
  color: ${({ theme }) => theme.colors.text.primary};
  padding-top: 80px;
  position: relative;
  z-index: 1;
`;

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <AuthProvider>
        <Router>
          <Background />
          <AppContainer>
            <Navbar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetail />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </AppContainer>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
