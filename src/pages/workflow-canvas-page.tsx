import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TopBar } from '../components/workflow/canvas/topbar';
import { Card } from '../components/ui/card';
import { Sidebar } from '../components/workflow/canvas/sidebar';
import { WorkflowCanvas } from '../components/workflow/canvas/workflow-canvas';

export function WorkflowCanvasPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [flowchartName, setFlowchartName] = useState('My Workflow');

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <TopBar id={id} flowchartName={flowchartName} setFlowchartName={setFlowchartName} navigate={navigate} />
      <div className="flex flex-grow">
        <Card className="m-4 mr-0 rounded-lg shadow-md border-none bg-white/95 backdrop-blur-sm">
          <Sidebar />
        </Card>
        <WorkflowCanvas id={id} />
      </div>
    </div>
  );
}