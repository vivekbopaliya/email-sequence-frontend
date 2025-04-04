import { Button } from '../../ui/button';
import { Mail, Clock, Users } from 'lucide-react';

const nodeTypes = [
  { type: 'leadSource', label: 'Lead Source', icon: Users },
  { type: 'wait', label: 'Wait/Delay', icon: Clock },
  { type: 'coldEmail', label: 'Cold Email', icon: Mail },
];

export function Sidebar() {
  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData('application/reactflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <aside className="w-64 rounded-lg h-full p-5 bg-white/95 flex flex-col">
      <h2 className="text-xl font-semibold mb-6 bg-gradient-to-r from-gray-800 to-gray-600 bg-clip-text text-transparent">
        Flow Nodes
      </h2>
      <div className="space-y-3">
        {nodeTypes.map(({ type, label, icon: Icon }) => (
          <div
            key={type}
            className="cursor-move transition-all hover:scale-[1.02]"
            draggable
            onDragStart={(e) => onDragStart(e, type)}
          >
            <Button
              variant="outline"
              className="w-full cursor-grab justify-start gap-3 p-4 border border-gray-200 hover:border-gray-300 hover:bg-gray-50 shadow-sm rounded-md text-gray-700"
            >
              <Icon className="h-5 w-5 text-gray-600" />
              <span className="font-medium">{label}</span>
            </Button>
          </div>
        ))}
      </div>
      <div className="mt-auto pt-6 border-t border-gray-200">
        <p className="text-xs text-gray-500 italic">
          Drag and drop nodes onto the canvas to build your workflow. Double tap to remove.
        </p>
      </div>
    </aside>
  );
}