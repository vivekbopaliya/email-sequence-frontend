import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom';
import { WorkflowDashboard } from './components/workflow/dashboard/workflows-dashboard';
import { AuthPage } from './pages/auth-page';
import { WorkflowCanvasPage } from './pages/workflow-canvas-page';
import { useEffect, useState } from 'react';
import { api } from './lib/api';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

// Because we can't call useGetCurrentUser hook here.
const isAuthenticated = async () => {
  try {
    const response = await api.get('/auth/me', {
      withCredentials: true, 
    });
    console.log('Auth check response:', response.data);
    return true; // If the request succeeds, user is authenticated
  } catch (error) {
    console.log('Auth check failed:', error);
    return false; // If the request fails (e.g., 401), user is not authenticated
  }
};

// ProtectedRoute component to guard routes
const ProtectedRoute = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status when the component mounts
    const checkAuth = async () => {
      const isAuth = await isAuthenticated();
      console.log(isAuth)
      setAuthenticated(isAuth);
      setAuthChecked(true);
    };
    checkAuth();
  }, []);

  if (!authChecked) {
    return <div className='flex items-center justify-center min-h-screen w-full'><Loader2 size={40} className='animate-spin'/></div>; 
  }

  // If authenticated, render the protected content; otherwise, redirect to /auth
  return authenticated ? <Outlet /> : <Navigate to="/auth" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Default route redirects to /auth */}
          <Route path="/" element={<Navigate to="/auth" replace />} />
          <Route path="/auth" element={<AuthPage />} />

          {/* Protected routes */}
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<WorkflowDashboard />} />
            <Route path="/workflows/new" element={<WorkflowCanvasPage />} />
            <Route path="/workflows/:id" element={<WorkflowCanvasPage />} />
          </Route>

          {/* Catch-all route to redirect to /auth */}
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;