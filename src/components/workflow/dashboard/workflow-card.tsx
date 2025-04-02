import { useState } from 'react';
import { Edit, Trash2, PlayCircle, CheckCircle, Clock } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../ui/dialog';

// Props for the WorkflowCard component
type WorkflowCardProps = {
  id: string;
  name: string;
  status: string;
  createdAt: string;
  onEdit: (id: string) => void;
  onDelete: (id: string) => Promise<void>;
  isWorkflowDeleting: boolean;
};

export function WorkflowCard({ id, name, status, createdAt, onEdit, onDelete, isWorkflowDeleting }: WorkflowCardProps) {
  // State for delete confirmation modal
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  // Display status with icon and style
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

  // Custom delete message based on status
  const getDeleteDescription = (status: string) => {
    switch (status) {
      case 'RUNNING':
        return 'This workflow is currently running. Deleting it will cancel all active schedulers.';
      case 'COMPLETED':
        return 'This workflow has completed. Deleting it will remove it permanently from your dashboard.';
      case 'PENDING':
      default:
        return 'This workflow is pending. Deleting it will remove it from your dashboard.';
    }
  };

  // Confirm deletion and close modal
  const handleDeleteConfirm = async () => {
    await onDelete(id);
    setIsDeleteModalOpen(false);
  };

  return (
    <Card className="border-none shadow-md hover:shadow-lg transition-shadow bg-white/95 backdrop-blur-sm overflow-hidden">
      <CardHeader className="pb-2 border-b border-gray-100">
        {/* Workflow name and status */}
        <CardTitle className="text-xl font-semibold text-gray-800 flex justify-between items-center">
          {name}
          <span>{getStatusDisplay(status)}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-4">
        <p className="text-sm text-gray-500 mb-4">Created: {new Date(createdAt).toDateString()}</p>
        <div className="flex justify-end gap-2">
          {/* Edit button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onEdit(id)}
            className="border-gray-200 text-gray-700 hover:bg-gray-50"
          >
            <Edit className="w-4 h-4 mr-2" />
            Edit
          </Button>
          {/* Delete button with confirmation modal */}
          <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
            <DialogTrigger asChild>
              <Button
                variant="destructive"
                size="sm"
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 hover:text-gray-800 border-none"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Are you sure you want to delete this workflow?</DialogTitle>
                <DialogDescription className="mt-2">{getDeleteDescription(status)}</DialogDescription>
              </DialogHeader>
              <DialogFooter className="mt-4">
                <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
                  Cancel
                </Button>
                <Button variant="destructive" isLoading={isWorkflowDeleting} onClick={handleDeleteConfirm}>
                  Delete
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </CardContent>
    </Card>
  );
}