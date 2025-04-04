import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCreateLeadSource } from '@/hooks/lead-source/lead-source-hook';
import { PlusIcon, Trash2 } from 'lucide-react';

export default function CreateLeadSourceModal({ isOpen, setIsOpen, setSelectedLeadSourceId }: {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  setSelectedLeadSourceId: (leadSourceId: string) => void;
}) {
  const [name, setName] = useState('');
  const [contacts, setContacts] = useState<{ name: string; email: string }[]>([{ name: '', email: '' }]);
  const { mutateAsync: createLeadSource, isPending: isCreating } = useCreateLeadSource();

  const handleAddContact = () => setContacts([...contacts, { name: '', email: '' }]);
  
  const handleContactChange = (index: number, field: 'name' | 'email', value: string) => {
    const newContacts = [...contacts];
    newContacts[index][field] = value;
    setContacts(newContacts);
  };

  const handleRemoveContact = (index: number) => {
    const newContacts = [...contacts];
    newContacts.splice(index, 1);
    setContacts(newContacts.length > 0 ? newContacts : [{ name: '', email: '' }]);
  };

  const handleCreate = async () => {
    const leadSource = await createLeadSource({ name, contacts });
    setSelectedLeadSourceId(leadSource.id); 
    setName('');
    setContacts([{ name: '', email: '' }]);
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-2xl text-green-600">Create New Lead Source</DialogTitle>
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
            {contacts.map((contact, index) => (
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
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={contacts[0].name === '' && contacts[0].email === ''}
                  onClick={() => handleRemoveContact(index)}
                  className="flex-shrink-0"
                >
                  <Trash2 className="h-5 w-5 text-red-500" />
                </Button>
              </div>
            ))}
            <Button variant="outline" onClick={handleAddContact} className="w-full">
              <PlusIcon className="mr-1" /> Add Contact
            </Button>
          </div>
          <Button isLoading={isCreating} onClick={handleCreate} disabled={isCreating} className="w-full">
            Save Lead Source
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}