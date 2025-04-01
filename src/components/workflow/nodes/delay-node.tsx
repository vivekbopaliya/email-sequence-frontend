import { Handle, Position } from 'reactflow';
import { Clock } from 'lucide-react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { useEffect, useState } from 'react';
import { Button } from '../../../components/ui/button';
import { Trash2 } from 'lucide-react';

export function DelayNode({ data, isConnectable, id, deleteNode }: any) {
  const [days, setDays] = useState(data.delay?.days || 0);
  const [hours, setHours] = useState(data.delay?.hours || 0);
  const [minutes, setMinutes] = useState(data.delay?.minutes || 1); // Default to 1 minute

  // Update the node's data when any value changes
  useEffect(() => {
    data.delay = {
      days: days,
      hours: hours,
      minutes: minutes,
    };
  }, [days, hours, minutes, data]);

 

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-orange-200 min-w-[250px]">
      <Handle type="target" position={Position.Top} isConnectable={isConnectable} />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Clock className="h-5 w-5 text-orange-500" />
          <h3 className="font-semibold text-lg">Wait/Delay</h3>
        </div>
     
      </div>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Delay Duration</Label>
          <div className="flex gap-2">
            <div className="flex-1">
              <Label htmlFor="days" className="text-sm">Days</Label>
              <Input
                id="days"
                type="number"
                min="0"
                placeholder="Days"
                value={days}
                onChange={(e) => setDays(Math.max(0, Number(e.target.value)))}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="hours" className="text-sm">Hours</Label>
              <Input
                id="hours"
                type="number"
                min="0"
                max="23"
                placeholder="Hours"
                value={hours}
                onChange={(e) => setHours(Math.max(0, Math.min(23, Number(e.target.value))))}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="minutes" className="text-sm">Minutes</Label>
              <Input
                id="minutes"
                type="number"
                min="0"
                max="59"
                placeholder="Minutes"
                value={minutes}
                onChange={(e) => setMinutes(Math.max(0, Math.min(59, Number(e.target.value))))}
              />
            </div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}