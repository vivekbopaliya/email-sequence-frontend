import { Handle, Position } from 'reactflow';
import { Users, Trash2 } from 'lucide-react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useState, useEffect } from 'react';

export function LeadSourceNode({ data, isConnectable, id, deleteNode }: any) {
  const [source, setSource] = useState(data.source || '');
  const [email, setEmail] = useState(data.email || '');

  // Update the node's data when inputs change
  useEffect(() => {
    data.source = source;
    data.email = email;
  }, [source, email, data]);



  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-green-200 min-w-[250px]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Users className="h-5 w-5 text-green-500" />
          <h3 className="font-semibold text-lg">Lead Source</h3>
      </div>
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="source">Source Name</Label>
          <Input
            id="source"
            placeholder="Enter source name (e.g., Website)"
            value={source}
            onChange={(e) => setSource(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Lead Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="Enter lead email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}