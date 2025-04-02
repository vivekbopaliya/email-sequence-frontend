import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { WorkflowDashboard } from './components/workflow/dashboard/workflows-dashboard';
import { AuthPage } from './pages/auth-page';
import { WorkflowCanvasPage } from './pages/workflow-canvas-page';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/auth" element={<AuthPage />} />
          <Route path="/dashboard" element={<WorkflowDashboard />} />
          <Route path="/workflows/new" element={<WorkflowCanvasPage />} />
          <Route path="/workflows/:id" element={<WorkflowCanvasPage />} />
          <Route path="*" element={<Navigate to="/auth" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;