import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Mail } from 'lucide-react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Card } from '../../../components/ui/card';

export function ColdEmailNode({ data, isConnectable }: any) {
  const [email, setEmail] = useState(data.email || '');
  const [subject, setSubject] = useState(data.subject || '');
  const [body, setBody] = useState(data.body || '');

  useEffect(() => {
    data.email = email;
    data.subject = subject;
    data.body = body;
  }, [email, subject, body, data]);

  

  return (
    <Card className="w-80 bg-white border-2 border-blue-200 p-4">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
      
      <div className="flex items-center gap-2 mb-4">
        <Mail className="w-5 h-5 text-blue-500" />
        <h3 className="font-semibold text-lg">Cold Email</h3>
      </div>

      <div className="space-y-4">
        
        <div className="space-y-2">
          <Label htmlFor="subject">Subject</Label>
          <Input
            id="subject"
            placeholder="Email subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="body">Body</Label>
          <Input
            id="body"
            placeholder="Email content..."
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </Card>
  );
}