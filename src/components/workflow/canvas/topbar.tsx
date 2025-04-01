import { useState, useEffect } from 'react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { Label } from '../../../components/ui/label';
import { ArrowLeft, MoreHorizontal, Play, RotateCw, StopCircle, Save } from 'lucide-react';
import {
  useGetFlow,
  useSaveFlow,
  useSaveAndStartFlow,
  useUpdateFlow,
  useUpdateAndStartFlow,
  useStartScheduler,
} from '../../../hooks/workflow/workflow-hook';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../../components/ui/dropdown-menu';

type TopBarProps = {
  id?: string;
  flowchartName: string;
  setFlowchartName: (name: string) => void;
  navigate: (path: string) => void;
};

export function TopBar({ id, flowchartName, setFlowchartName, navigate }: TopBarProps) {
  const [isSaving, setIsSaving] = useState(false);
  const saveFlow = useSaveFlow();
  const saveAndStartFlow = useSaveAndStartFlow();
  const updateFlow = useUpdateFlow();
  const updateAndStartFlow = useUpdateAndStartFlow();
  const startScheduler = useStartScheduler();
  const { data: existingFlow, isLoading } = useGetFlow(id || '');

  useEffect(() => {
    if (existingFlow && !isLoading) {
      setFlowchartName(existingFlow.name);
    }
  }, [existingFlow, isLoading]);

  const handleCancelScheduler = async () => {
    if (!id) return;
    try {
      setIsSaving(true);
      await startScheduler.mutateAsync(id); // Cancel & restart will use the same endpoint for simplicity
    } catch (error) {
      console.error('Error canceling scheduler:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleStartScheduler = async () => {
    if (!id) return;
    try {
      setIsSaving(true);
      await startScheduler.mutateAsync(id);
    } catch (error) {
      console.error('Error starting scheduler:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleSaveWorkflow = async (start: boolean = false) => {
    try {
      setIsSaving(true);
      const flowData = {
        name: flowchartName,
        nodes: existingFlow?.nodes || [],
        edges: existingFlow?.edges || [],
      };

      if (id) {
        if (start) {
          await updateAndStartFlow.mutateAsync({ id, data: flowData });
        } else {
          await updateFlow.mutateAsync({ id, data: flowData });
        }
      } else {
        if (start) {
          const result = await saveAndStartFlow.mutateAsync(flowData);
          navigate(`/workflows/${result.id}`);
        } else {
          const result = await saveFlow.mutateAsync(flowData);
          navigate(`/workflows/${result.id}`);
        }
      }
    } catch (error) {
      console.error('Error saving workflow:', error);
    } finally {
      setIsSaving(false);
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
        <Button
          onClick={() => navigate('/dashboard')}
          className="flex items-center gap-1 "
        >
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
            {<Button
              onClick={handleCancelScheduler}
              disabled={isSaving || !existingFlow || existingFlow.status !== 'RUNNING'}
              variant="destructive"
              className="flex items-center gap-1 text-white"
            >
              <StopCircle size={16} />
              Cancel Scheduler
            </Button>}
            <Button
              onClick={handleStartScheduler}
              disabled={isSaving}
              variant="outline"
              className="flex items-center gap-1 "
            >
              {getSchedulerButtonLabel()}
            </Button>
          </>
        )}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="default" className="flex items-center gap-4 ">
              <MoreHorizontal size={16} />
              {id ? "Update" : "Save"}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => handleSaveWorkflow(false)} className="flex items-center gap-2">
              <Save size={16} />
              {id ? 'Update Workflow' : 'Save Workflow'}
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => handleSaveWorkflow(true)} className="flex items-center gap-2">
              <Save size={16} />
              {id ? 'Update & Start' : 'Save & Start'}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}