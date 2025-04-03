import { useState, useEffect } from 'react';
import { Handle, Position } from 'reactflow';
import { Mail, Plus } from 'lucide-react';
import { Card } from '../../../components/ui/card';
import { Dialog } from '../../../components/ui/dialog';
import { useGetEmailTemplates } from '@/hooks/email-templates/email-template-hook';
import TemplateSelectionModal from '../email-template/template-selection-modal';

export function ColdEmailNode({ data, isConnectable }: any) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(data.emailTemplateId || null);
  const { data: templates } = useGetEmailTemplates();

  // Update node data when template is selected
  useEffect(() => {
    data.emailTemplateId = selectedTemplateId; // Only store the ID in the node data
  }, [selectedTemplateId, data]);

  // Find the selected template for display purposes
  const selectedTemplate = templates?.find((t: any) => t.id === selectedTemplateId);

  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
      <Card 
        className="min-w-[350px] bg-white border-2 border-blue-200 p-6 hover:cursor-pointer hover:border-blue-300 transition-colors"
        onClick={() => setIsModalOpen(true)}
      >
        <Handle type="target" position={Position.Top} isConnectable={isConnectable} />
        <div className="flex items-center gap-3 mb-6">
          <Mail className="w-6 h-6 text-blue-500" />
          <h3 className="font-semibold text-xl">Cold Email</h3>
        </div>
        <div className="flex justify-center items-center h-[120px]">
          {selectedTemplate ? (
            <div className="text-center">
              <p className="text-lg font-medium text-gray-700">{selectedTemplate.name}</p>
              <p className="text-sm text-gray-500 mt-1">{selectedTemplate.subject}</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3">
              <Plus className="w-14 h-14 text-blue-500" />
              <p className="text-sm text-gray-500">Select a template</p>
            </div>
          )}
        </div>
        <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
      </Card>
      <TemplateSelectionModal 
        setIsModalOpen={setIsModalOpen} 
        selectedTemplateId={selectedTemplateId} 
        setSelectedTemplateId={setSelectedTemplateId}
      />
    </Dialog>
  );
}