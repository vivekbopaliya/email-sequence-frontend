import { Handle, Position } from 'reactflow';
import { Clock } from 'lucide-react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { useEffect, useState } from 'react';

export function DelayNode({ data, isConnectable }: any) {
  const [days, setDays] = useState<number>(data.delay?.days || 0);
  const [hours, setHours] = useState<number>(data.delay?.hours || 0);
  const [minutes, setMinutes] = useState<number>(data.delay?.minutes || 1); 

  useEffect(() => {
    data.delay = {
      days: days,
      hours: hours,
      minutes: minutes,
    };
  }, [days, hours, minutes, data]);

  // Function to validate input to ensure only numbers are accepted
  const handleNumericInput = (e: React.ChangeEvent<HTMLInputElement>, setter: React.Dispatch<React.SetStateAction<number>>, min: number, max: number) => {
    const value = e.target.value;
    
    if (value === '') {
      setter(0);
      return;
    }
    
    // Check if value contains only digits
    if (/^\d+$/.test(value)) {
      const numValue = parseInt(value, 10);
      // Apply constraints
      setter(Math.max(min, Math.min(max || Number.MAX_SAFE_INTEGER, numValue)));
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-orange-200 max-w-[400px]">
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
                type="text"
                inputMode="numeric"
                placeholder="Days"
                value={days}
                onChange={(e) => handleNumericInput(e, setDays, 0, 30)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="hours" className="text-sm">Hours</Label>
              <Input
                id="hours"
                type="text"
                inputMode="numeric"
                placeholder="Hours"
                value={hours}
                onChange={(e) => handleNumericInput(e, setHours, 0, 23)}
              />
            </div>
            <div className="flex-1">
              <Label htmlFor="minutes" className="text-sm">Minutes</Label>
              <Input
                id="minutes"
                type="text"
                inputMode="numeric"
                placeholder="Minutes"
                value={minutes}
                onChange={(e) => handleNumericInput(e, setMinutes, 0, 59)}
              />
            </div>
          </div>
        </div>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}