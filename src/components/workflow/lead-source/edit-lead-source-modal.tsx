import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useUpdateLeadSource } from '@/hooks/lead-source/lead-source-hook';

export default function EditLeadSourceModal({ isOpen, setIsOpen, leadSource, setSelectedLeadSourceId }: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  leadSource: any; 
  setSelectedLeadSourceId: (leadSourceId: string) => void;
}) {
  const [name, setName] = useState(leadSource?.name || '');
  const [contacts, setContacts] = useState(leadSource?.contacts || [{ name: '', email: '' }]);
  const { mutateAsync: updateLeadSource, isPending: isUpdating } = useUpdateLeadSource();

  useEffect(() => {
    if (leadSource) {
      setName(leadSource.name);
      setContacts(leadSource.contacts);
    }
  }, [leadSource]);

  const handleAddContact = () => setContacts([...contacts, { name: '', email: '' }]);
  const handleContactChange = (index: number, field: 'name' | 'email', value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

const handleUpdate = async () => {
  try {
    const updatedLeadSource = await updateLeadSource({ id: leadSource.id, name, contacts });
    setSelectedLeadSourceId(updatedLeadSource.id); 
    setIsOpen(false);
  } catch (error) {
    console.error('Error updating lead source:', error);
  }
};

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl text-green-600">Edit Lead Source</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="lead-source-name">Name</Label>
            <Input
              id="lead-source-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter lead source name"
            />
          </div>
          <div className="space-y-4">
            <Label>Contacts</Label>
            {contacts.map((contact: any, index: number) => (
              <div key={index} className="flex gap-2">
                <Input
                  value={contact.name}
                  onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                  placeholder="Contact name"
                />
                <Input
                  value={contact.email}
                  onChange={(e) => handleContactChange(index, 'email', e.target.value)}
                  placeholder="Contact email"
                />
              </div>
            ))}
            <Button variant="outline" onClick={handleAddContact} className="w-full">
              Add Contact
            </Button>
          </div>
          <Button onClick={handleUpdate} disabled={isUpdating} className="w-full">
            {isUpdating ? 'Updating...' : 'Update Lead Source'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}