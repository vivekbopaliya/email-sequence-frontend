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

type TopBarProps = {
  id?: string;
  flowchartName: string;
  setFlowchartName: (name: string) => void;
  navigate: (path: string) => void;
  nodes: Node[];
  edges: Edge[];
};

export function TopBar({ id, flowchartName, setFlowchartName, navigate, nodes, edges }: TopBarProps) {
  const { mutateAsync: saveWorkflow, isPending: isWorkflowSaving } = useSaveFlow();
  const { mutateAsync: saveAndStartFlow, isPending: isSavingAndStartingWorkflow } = useSaveAndStartFlow();
  const { mutateAsync: updateWorkflow, isPending: isUpdatingWorkflow } = useUpdateFlow();
  const { mutateAsync: updateAndStartWorklow, isPending: isUpdatingAndStartingWorkflow } = useUpdateAndStartFlow();
  const { mutateAsync: startScheduler, isPending: isStartingScheduler } = useStartScheduler();
  const { mutateAsync: stopScheduler, isPending: isStopingScheduler } = useStopScheduler();
  const { data: existingFlow, isLoading } = useGetFlow(id || '');

  const [isValidationModalOpen, setIsValidationModalOpen] = useState(false);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (existingFlow && !isLoading) {
      setFlowchartName(existingFlow.name);
    }
  }, [existingFlow, isLoading, setFlowchartName]);

  const validateWorkflow = () => {
    const leadSourceNodes = nodes.filter((node) => node.type === 'leadSource');
    const coldEmailNodes = nodes.filter((node) => node.type === 'coldEmail');

    const hasEmptyLeadSource = leadSourceNodes.some((node) => !node.data.contacts || node.data.contacts.length === 0);
    if (hasEmptyLeadSource) {
      setValidationMessage('All Lead Source nodes must have at least one email address.');
      return false;
    }

    const hasInvalidEmailNode = coldEmailNodes.some(
      (node) => !node.data.subject?.trim() || !node.data.body?.trim()
    );
    if (hasInvalidEmailNode) {
      setValidationMessage('All Cold Email nodes must have a subject and body.');
      return false;
    }

    return true;
  };

  const handleCancelScheduler = async () => {
    if (!id) return;
    await stopScheduler(id);
  };

  const handleStartScheduler = async () => {
    if (!id) return;
    await startScheduler(id);
  };

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
        <Button onClick={() => navigate('/dashboard')} className="flex items-center gap-1">
          <ArrowLeft size={16} />
          Back
        </Button>
        <Label htmlFor="flowchart-name" className="text-gray-700 font-medium">
          Workflow Name:
        </Label>
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