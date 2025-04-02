import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useLogout } from '@/hooks/auth/auth-hook';
import { useDeleteFlow, useGetFlows } from '@/hooks/workflow/workflow-hook';
import { WorkflowCard } from './workflow-card';

export function WorkflowDashboard() {
  const navigate = useNavigate();
  // Fetch workflows and handle auth/logout
  const { data: flows, isLoading, error } = useGetFlows();
  const { mutateAsync: deleteWorkflow, isPending: isWorkflowDeleting } = useDeleteFlow();
  const { mutateAsync: logoutUser, isPending: isLoggingOut } = useLogout();

  // Redirect to login if unauthorized
  useEffect(() => {
    if (error && (error as any).response?.status === 401) {
      navigate('/auth');
    }
  }, [error, navigate]);

  // Navigate to new workflow page
  const handleCreateNew = () => {
    navigate('/workflows/new');
  };

  // Navigate to edit workflow page
  const handleEdit = (id: string) => {
    navigate(`/workflows/${id}`);
  };

  // Delete a workflow
  const handleDelete = async (id: string) => {
    await deleteWorkflow(id);
  };

  // Logout and redirect to auth page
  const handleLogout = async () => {
    try {
      await logoutUser();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="text-lg text-gray-600 animate-pulse">
          <LayoutDashboard className="inline mr-2 w-5 h-5" />
          Loading your workflows...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-6">
        {/* Header with title and buttons */}
        <div className="mb-8 bg-white/80 backdrop-blur-sm rounded-lg shadow-md p-6">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
              Your Workflows
            </h1>
            <div className="flex gap-3">
              <Button
                onClick={handleCreateNew}
                className="bg-gradient-to-r from-gray-700 to-gray-900 hover:from-gray-800 hover:to-gray-950 text-white shadow-md transition-all"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Workflow
              </Button>
              <Button
                variant="outline"
                onClick={handleLogout}
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Empty state or workflow list */}
        {flows?.length === 0 ? (
          <Card className="text-center p-8 bg-white/95 backdrop-blur-sm border-none shadow-lg">
            <CardContent className="pt-6">
              <div className="mb-6 mx-auto w-16 h-16 flex items-center justify-center rounded-full bg-gray-100">
                <LayoutDashboard className="w-8 h-8 text-gray-500" />
              </div>
              <p className="text-lg text-gray-600 mb-6">You haven't created any workflows yet.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {flows.map((flow: any) => (
              <WorkflowCard
                key={flow.id}
                id={flow.id}
                name={flow.name}
                status={flow.status}
                createdAt={flow.createdAt}
                onEdit={handleEdit}
                isWorkflowDeleting={isWorkflowDeleting}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}