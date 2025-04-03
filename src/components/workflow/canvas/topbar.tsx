import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft, MoreHorizontal, Play, RotateCw, StopCircle, Save, PlaySquare } from 'lucide-react';
import {
  useGetFlow,
  useSaveFlow,
  useSaveAndStartFlow,
  useUpdateFlow,
  useUpdateAndStartFlow,
  useStartScheduler,
  useStopScheduler,
} from '../../../hooks/workflow/workflow-hook';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../components/ui/dialog';
import { Node, Edge } from 'reactflow';

// Props for the TopBar component
type TopBarProps = {
  id?: string;
  flowchartName: string;
  setFlowchartName: (name: string) => void;
  navigate: (path: string) => void;
  nodes: Node[];
  edges: Edge[];
};

export function TopBar({ id, flowchartName, setFlowchartName, navigate, nodes, edges }: TopBarProps) {
  // Workflow action hooks
  const { mutateAsync: saveWorkflow, isPending: isWorkflowSaving } = useSaveFlow();
  const { mutateAsync: saveAndStartFlow, isPending: isSavingAndStartingWorkflow } = useSaveAndStartFlow();
  const { mutateAsync: updateWorkflow, isPending: isUpdatingWorkflow } = useUpdateFlow();
  const { mutateAsync: updateAndStartWorklow, isPending: isUpdatingAndStartingWorkflow } = useUpdateAndStartFlow();
  const { mutateAsync: startScheduler, isPending: isStartingScheduler } = useStartScheduler();
  const { mutateAsync: stopScheduler, isPending: isStopingScheduler } = useStopScheduler();
  const { data: existingFlow, isLoading } = useGetFlow(id || '');

  // State for validation modal
  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  // Sync flowchart name with fetched data
  useEffect(() => {
    if (existingFlow && !isLoading) {
      setFlowchartName(existingFlow.name);
    }
  }, [existingFlow, isLoading, setFlowchartName]);

  // Check if workflow nodes are valid
  const validateWorkflow = () => {
    const leadSourceNodes = nodes.filter((node) => node.type === 'leadSource');
    const coldEmailNodes = nodes.filter((node) => node.type === 'coldEmail');

    const hasEmptyLeadSource = leadSourceNodes.some((node) => !node.data.leadSourceId);
    if (hasEmptyLeadSource) {
      setValidationMessage('Please select a Lead Source');
      return false;
    }

    const hasInvalidEmailNode = coldEmailNodes.some(
      (node) => !node.data.emailTemplateId 
    );
    if (hasInvalidEmailNode) {
      setValidationMessage('Please select an Email Template');
      return false;
    }

    return true;
  };

  // Stop the scheduler for this workflow
  const handleCancelScheduler = async () => {
    if (!id) return;
    await stopScheduler(id);
  };

  // Start the scheduler for this workflow
  const handleStartScheduler = async () => {
    if (!id) return;
    await startScheduler(id);
  };

  // Save or update the workflow, optionally starting it
  const handleSaveWorkflow = async (start: boolean = false) => {
    if (!validateWorkflow()) {
      setIsValidationModalOpen(true);
      return;
    }

    const flowData = {
      name: flowchartName,
      nodes: nodes,
      edges: edges,
    };

    try {
      if (id) {
        if (start) {
          await updateAndStartWorklow({ id, data: flowData });
        } else {
          await updateWorkflow({ id, data: flowData });
        }
      } else {
        if (start) {
          const result = await saveAndStartFlow(flowData);
          navigate(`/workflows/${result.id}`);
        } else {
          const result = await saveWorkflow(flowData);
          navigate(`/workflows/${result.id}`);
        }
      }
    } catch (error) {
      console.error('Error saving/updating workflow:', error);
    }
  };

  // Dynamic button label based on workflow status
  const getSchedulerButtonLabel = () => {
    if (!existingFlow?.status) return <span className="flex items-center"><Play className="w-4 h-4 mr-1" /> Start</span>;
    switch (existingFlow.status) {
      case 'RUNNING':
        return <span className="flex items-center"><StopCircle className="w-4 h-4 mr-1" /> Cancel & Restart</span>;
      case 'PENDING':
        return <span className="flex items-center"><Play className="w-4 h-4 mr-1" /> Start</span>;
      case 'COMPLETED':
        return <span className="flex items-center"><RotateCw className="w-4 h-4 mr-1" /> Restart</span>;
      default:
        return <span className="flex items-center"><Play className="w-4 h-4 mr-1" /> Start</span>;
    }
  };

  return (
    <div className="bg-white/95 backdrop-blur-sm shadow-sm p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {/* Back button */}
        <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-1">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Label htmlFor="flowchart-name" className="text-gray-700 font-medium">
          Workflow Name:
        </Label>
        {/* Workflow name input */}
        <Input
          id="flowchart-name"
          value={flowchartName}
          onChange={(e) => setFlowchartName(e.target.value)}
          className="w-64 border-gray-200 focus:border-gray-500 focus:ring-gray-500"
          placeholder="Enter workflow name..."
        />
      </div>
      <div className="flex gap-3">
        {id && (
          <>
            {existingFlow?.status === 'RUNNING' ? (
              // Stop button for running workflows
              <Button
                onClick={handleCancelScheduler}
                isLoading={isStopingScheduler}
                disabled={!existingFlow || existingFlow.status !== 'RUNNING'}
                variant="destructive"
                className="flex items-center gap-1 text-white"
              >
                <StopCircle size={16} />
                Stop Scheduler
              </Button>
            ) : (
              // Start/Restart button for non-running workflows
              <Button
                onClick={handleStartScheduler}
                isLoading={isStartingScheduler}
                variant="outline"
                className="flex items-center gap-1"
              >
                {getSchedulerButtonLabel()}
              </Button>
            )}
          </>
        )}
        {/* Save/Update dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="default"
              className="flex items-center gap-2"
              isLoading={
                isWorkflowSaving || isUpdatingWorkflow || isSavingAndStartingWorkflow || isUpdatingAndStartingWorkflow
              }
            >
              <MoreHorizontal size={16} />
              {id ? 'Update' : 'Save'}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSaveWorkflow(false)} className="flex items-center gap-2">
              <Save size={16} />
              {id ? 'Update Workflow' : 'Save Workflow'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSaveWorkflow(true)} className="flex items-center gap-2">
              <PlaySquare size={16} />
              {id ? 'Update & Start Scheduler' : 'Save & Start Scheduler'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Validation error modal */}
      <Dialog open={isValidationModalOpen} onOpenChange={setIsValidationModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className='text-red-500'>Warning!</DialogTitle>
            <DialogDescription className='mt-2 text-black text-sm'>{validationMessage}</DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsValidationModalOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}