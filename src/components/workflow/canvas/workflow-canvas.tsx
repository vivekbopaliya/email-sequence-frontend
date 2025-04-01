import { useCallback, useEffect } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
  Connection,
  Edge,
  Node,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { ColdEmailNode } from '../nodes/cold-email-node';
import { LeadSourceNode } from '../nodes/lead-source-node';
import { DelayNode } from '../nodes/delay-node';
import { useGetFlow } from '../../../hooks/workflow/workflow-hook';

const nodeTypes = {
  coldEmail: ColdEmailNode,
  wait: DelayNode,
  leadSource: LeadSourceNode,
};

const initialNodes = [
  {
    id: 'start',
    type: 'leadSource',
    position: { x: 250, y: 0 },
    data: { label: 'Lead Source' },
  },
];

type WorkflowCanvasProps = {
  id?: string;
};

export function WorkflowCanvas({ id }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { data: existingFlow, isLoading } = useGetFlow(id || '');

  useEffect(() => {
    if (existingFlow && !isLoading) {
      setNodes(existingFlow.nodes);
      setEdges(existingFlow.edges);
    }
  }, [existingFlow, isLoading, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Edge | Connection) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'move';
  }, []);

  const onDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const type = event.dataTransfer.getData('application/reactflow');
      if (!type) return;

      const reactFlowBounds = event.currentTarget.getBoundingClientRect();
      const position = {
        x: event.clientX - reactFlowBounds.left,
        y: event.clientY - reactFlowBounds.top,
      };

      const newNode = {
        id: `${type}-${Date.now()}`,
        type,
        position,
        data: {
          label: type,
          ...(type === 'wait' ? { delay: 1 } : {}),
          ...(type === 'coldEmail' ? { subject: '', body: '' } : {}),
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const onNodeDelete = useCallback(
    (nodesToDelete: Node[]) => {
      setNodes((nds) => nds.filter((node) => !nodesToDelete.find((n) => n.id === node.id)));
      setEdges((eds) =>
        eds.filter(
          (edge) => !nodesToDelete.find((n) => n.id === edge.source || n.id === edge.target),
        ),
      );
    },
    [setNodes, setEdges],
  );

  const onEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((eds) => eds.filter((edge) => edge.id !== edgeId));
    },
    [setEdges],
  );

  return (
    <div className="flex-grow h-full mb-10 ml-4 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDrop={onDrop}
        onDragOver={onDragOver}
        onNodesDelete={onNodeDelete}
        onEdgeDoubleClick={(_, edge) => onEdgeDelete(edge.id)}
        nodeTypes={nodeTypes}
        onNodeDoubleClick={(_, node) => onNodeDelete([node])}
        fitView
        className="rounded-lg"
      >
        <Controls className="m-4 bg-white shadow-md rounded-md border border-gray-100" />
        <MiniMap className="m-4 bg-white rounded-md border border-gray-100 shadow-md" />
        <Background gap={16} size={1} />
      </ReactFlow>
    </div>
  );
}