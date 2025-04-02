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
import { useGetFlow } from '../../../hooks/workflow/workflow-hook';
import { initialNodes, nodeTypes } from '@/lib/utils';

type WorkflowCanvasProps = {
  id?: string;
  onNodesChange: (nodes: Node[]) => void;
  onEdgesChange: (edges: Edge[]) => void;
};

export function WorkflowCanvas({ id, onNodesChange, onEdgesChange }: WorkflowCanvasProps) {
  const [nodes, setNodes, onNodesChangeInternal] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChangeInternal] = useEdgesState([]);
  const { data: existingFlow, isLoading } = useGetFlow(id || '');

  useEffect(() => {
    onNodesChange(nodes);
  }, [nodes, onNodesChange]);

  useEffect(() => {
    onEdgesChange(edges);
  }, [edges, onEdgesChange]);

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
          ...(type === 'leadSource' ? { source: '', contacts: [] } : {}), 
        },
      };

      setNodes((nds) => nds.concat(newNode));
    },
    [setNodes],
  );

  const onNodeDelete = useCallback(
    (nodesToDelete: Node[]) => {
      setNodes((nds) => {
        const updatedNodes = nds.filter((node) => !nodesToDelete.find((n) => n.id === node.id));
        onNodesChange(updatedNodes); 
        return updatedNodes;
      });
      setEdges((eds) => {
        const updatedEdges = eds.filter(
          (edge) => !nodesToDelete.find((n) => n.id === edge.source || n.id === edge.target),
        );
        onEdgesChange(updatedEdges); 
        return updatedEdges;
      });
    },
    [setNodes, setEdges, onNodesChange, onEdgesChange],
  );

  const onEdgeDelete = useCallback(
    (edgeId: string) => {
      setEdges((eds) => {
        const updatedEdges = eds.filter((edge) => edge.id !== edgeId);
        onEdgesChange(updatedEdges); 
        return updatedEdges;
      });
    },
    [setEdges, onEdgesChange],
  );

  return (
    <div className="flex-grow h-full mb-10 ml-4 rounded-lg overflow-hidden">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChangeInternal}
        onEdgesChange={onEdgesChangeInternal}
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