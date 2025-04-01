import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit, Trash2, LayoutDashboard, Clock, CheckCircle, PlayCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { useLogout } from '../../hooks/auth/auth-hook';
import { useDeleteFlow, useGetFlows } from '../../hooks/workflow/workflow-hook';

export function WorkflowDashboard() {
  const navigate = useNavigate();
  const { data: flows, isLoading, error } = useGetFlows();
  const deleteFlow = useDeleteFlow();
  const logout = useLogout();

  useEffect(() => {
    if (error && (error as any).response?.status === 401) {
      navigate('/auth');
    }
  }, [error, navigate]);

  const handleCreateNew = () => {
    navigate('/workflows/new');
  };

  const handleEdit = (id: string) => {
    navigate(`/workflows/${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteFlow.mutateAsync(id);
    } catch (error) {
      console.error('Error deleting workflow:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await logout.mutateAsync();
      navigate('/auth');
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

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

  const getStatusDisplay = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 animate-pulse">
            <PlayCircle className="w-4 h-4 mr-1 animate-spin" />
            Running
          </span>
        );
      case 'COMPLETED':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <CheckCircle className="w-4 h-4 mr-1" />
            Completed
          </span>
        );
      case 'PENDING':
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            <Clock className="w-4 h-4 mr-1" />
            Pending
          </span>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10">
      <div className="container mx-auto px-4 sm:px-6">
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
            {flows?.map((flow: any) => (
              <Card
                key={flow.id}
                className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm overflow-hidden"
              >
                <CardHeader className="pb-2 border-b border-gray-100">
                  <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
                    {flow.name}
                    <span>{getStatusDisplay(flow.status)}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                  <p className="text-sm text-gray-500 mb-4">
                    Created: {new Date(flow.createdAt).toDateString()}
                  </p>
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(flow.id)}
                      className="border-gray-200 text-gray-700 hover:bg-gray-50"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(flow.id)}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 border-none"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}