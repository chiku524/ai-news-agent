import React, { Suspense, lazy, useEffect } from 'react';
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Components
import LandingPage from './components/LandingPage';
import SignIn from './components/Auth/SignIn';
import Register from './components/Auth/Register';
import OAuthCallback from './components/Auth/OAuthCallback';
import Layout from './components/Layout';
import LoadingSpinner from './components/LoadingSpinner';

// Context
import { ThemeProvider as CustomThemeProvider, useTheme } from './contexts/ThemeContext';
import { SidebarProvider } from './contexts/SidebarContext';
import { userAPI } from './services/api';

// Lazy load components for better performance
const Dashboard = lazy(() => import('./components/Dashboard/Dashboard'));
const Trending = lazy(() => import('./components/Trending'));
const ForYou = lazy(() => import('./components/ForYou'));
const NewsFeed = lazy(() => import('./components/NewsFeed'));
const NewsDetail = lazy(() => import('./components/NewsDetail'));
const UserProfile = lazy(() => import('./components/UserProfile'));
const SearchResults = lazy(() => import('./components/SearchResults'));
const Analytics = lazy(() => import('./components/Analytics'));
const SavedArticles = lazy(() => import('./components/SavedArticles'));
const LikedArticles = lazy(() => import('./components/LikedArticles'));
const Settings = lazy(() => import('./components/Settings'));
const BackgroundTest = lazy(() => import('./components/BackgroundTest'));
const SimpleBackgroundTest = lazy(() => import('./components/SimpleBackgroundTest'));
const NotFound = lazy(() => import('./components/NotFound'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
    },
  },
});

const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background-color: ${props => props.theme.colors.background};
    color: ${props => props.theme.colors.text};
    line-height: 1.6;
  }

  code {
    font-family: 'Fira Code', 'Monaco', 'Consolas', 'Courier New', monospace;
  }

  a {
    color: ${props => props.theme.colors.primary};
    text-decoration: none;
    transition: color 0.2s ease;
  }

  a:hover {
    color: ${props => props.theme.colors.primaryHover};
  }

  button {
    cursor: pointer;
    border: none;
    outline: none;
    font-family: inherit;
  }

  input, textarea {
    font-family: inherit;
  }

  ::-webkit-scrollbar {
    width: 8px;
  }

  ::-webkit-scrollbar-track {
    background: ${props => props.theme.colors.background};
  }

  ::-webkit-scrollbar-thumb {
    background: ${props => props.theme.colors.border};
    border-radius: 4px;
  }

  ::-webkit-scrollbar-thumb:hover {
    background: ${props => props.theme.colors.textSecondary};
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: ${props => props.theme.colors.background};
`;

const AppContent = () => {
  const { theme, currentTheme, setTheme } = useTheme();

  // Flush "reading_session" durations when user returns focus to the app
  useEffect(() => {
    const onFocus = async () => {
      try {
        const raw = localStorage.getItem('reading_session');
        if (!raw) return;
        const session = JSON.parse(raw);
        if (!session?.started_at || !session?.article_id) return;
        const durationMs = Date.now() - session.started_at;
        if (durationMs > 0) {
          await userAPI.trackActivity({
            type: 'read',
            article_id: session.article_id,
            article_title: session.article_title,
            article_source: session.article_source,
            duration_ms: durationMs,
            metadata: { method: 'focus_return' }
          });
        }
      } catch {}
      finally {
        try { localStorage.removeItem('reading_session'); } catch {}
      }
    };
    window.addEventListener('focus', onFocus);
    return () => window.removeEventListener('focus', onFocus);
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      <GlobalStyle />
      <SidebarProvider>
        <Router>
          <AppContainer>
            <Routes>
            <Route path="/" element={<LandingPage theme={theme} onThemeChange={setTheme} />} />
            <Route path="/signin" element={<SignIn />} />
            <Route path="/register" element={<Register />} />
            <Route path="/auth/callback" element={<OAuthCallback />} />
            <Route path="/test-background" element={
              <Suspense fallback={<LoadingSpinner message="Loading test..." />}>
                <BackgroundTest />
              </Suspense>
            } />
            <Route path="/simple-test" element={
              <Suspense fallback={<LoadingSpinner message="Loading simple test..." />}>
                <SimpleBackgroundTest />
              </Suspense>
            } />
            <Route path="/dashboard" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading dashboard..." />}>
                  <Dashboard />
                </Suspense>
              </Layout>
            } />
            <Route path="/trending" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading trending..." />}>
                  <Trending />
                </Suspense>
              </Layout>
            } />
            <Route path="/for-you" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Personalizing your feed..." />}>
                  <ForYou />
                </Suspense>
              </Layout>
            } />
            <Route path="/news" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading news..." />}>
                  <NewsFeed />
                </Suspense>
              </Layout>
            } />
            <Route path="/news/:id" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading article..." />}>
                  <NewsDetail />
                </Suspense>
              </Layout>
            } />
            <Route path="/search" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading search..." />}>
                  <SearchResults />
                </Suspense>
              </Layout>
            } />
            <Route path="/profile" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading profile..." />}>
                  <UserProfile />
                </Suspense>
              </Layout>
            } />
            <Route path="/analytics" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading analytics..." />}>
                  <Analytics />
                </Suspense>
              </Layout>
            } />
            <Route path="/saved" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading saved articles..." />}>
                  <SavedArticles />
                </Suspense>
              </Layout>
            } />
            <Route path="/liked" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading liked articles..." />}>
                  <LikedArticles />
                </Suspense>
              </Layout>
            } />
            <Route path="/settings" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading settings..." />}>
                  <Settings />
                </Suspense>
              </Layout>
            } />
            <Route path="*" element={
              <Layout>
                <Suspense fallback={<LoadingSpinner message="Loading..." />}>
                  <NotFound />
                </Suspense>
              </Layout>
            } />
          </Routes>
          </AppContainer>
          
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: currentTheme.colors.surface,
                color: currentTheme.colors.text,
                border: `1px solid ${currentTheme.colors.border}`,
              },
            }}
          />
        </Router>
      </SidebarProvider>
    </ThemeProvider>
  );
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomThemeProvider>
        <AppContent />
      </CustomThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
