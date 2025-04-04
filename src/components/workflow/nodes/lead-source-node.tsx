import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Users, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Dialog } from '../../../components/ui/dialog';
import { useGetLeadSources } from '@/hooks/lead-source/lead-source-hook';
import LeadSourceSelectionModal from '../lead-source/lead-source-selection-modal';

export function LeadSourceNode({ data, isConnectable }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedLeadSourceId, setSelectedLeadSourceId] = useState<string | null>(data.leadSourceId || null);
  const { data: leadSources } = useGetLeadSources();

  useEffect(() => {
    data.leadSourceId = selectedLeadSourceId;
  }, [selectedLeadSourceId, data]);
  
  // Find the selected lead source for display purposes
  const selectedLeadSource = leadSources?.find((ls: any) => ls.id === selectedLeadSourceId);
 
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Card 
        className="min-w-[350px] bg-white border-2 border-green-200 p-6 hover:cursor-pointer hover:border-green-300 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
        <div className="flex items-center gap-3 mb-6">
          <Users className="w-6 h-6 text-green-500" />
          <h3 className="font-semibold text-xl">Lead Source</h3>
        </div>
        <div className="flex justify-center items-center h-[120px]">
          {selectedLeadSource ? (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">{selectedLeadSource.name}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Plus className="w-14 h-14 text-green-500" />
              <p className="text-sm text-gray-500">Select a lead source</p>
            </div>
          )}
        </div>
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      </Card>
      <LeadSourceSelectionModal 
        setIsModalOpen={setIsModalOpen} 
        selectedLeadSourceId={selectedLeadSourceId} 
        setSelectedLeadSourceId={setSelectedLeadSourceId}
      />
    </Dialog>
  );
}