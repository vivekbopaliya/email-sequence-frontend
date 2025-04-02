import { Handle, Position } from 'reactflow';
import { Users, Plus, Trash2, MailOpen, MailX } from 'lucide-react';
import { Label } from '../../../components/ui/label';
import { Input } from '../../../components/ui/input';
import { Button } from '../../../components/ui/button';
import { useState, useEffect } from 'react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';


export function LeadSourceNode({ data, isConnectable, id }: any) {
  const [source, setSource] = useState(data.source || '');
  const [contacts, setContacts] = useState<string[]>(data.contacts || []);
  const [newEmail, setNewEmail] = useState(''); 
  const [isOpen, setIsOpen] = useState(false); 

  useEffect(() => {
    data.source = source;
    data.contacts = contacts; 
  }, [source, contacts, data]);

  const handleAddEmail = () => {
    if (newEmail.trim() && !contacts.includes(newEmail.trim())) {
      setContacts((prev) => [...prev, newEmail.trim()]);
      setNewEmail(''); 
    }
  };

  const handleRemoveEmail = (emailToRemove: string) => {
    setContacts((prev) => prev.filter((email) => email !== emailToRemove));
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-4 border-2 border-green-200 min-w-[300px]">
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

        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <div className="flex items-center justify-between">
            <Label>Lead Emails</Label>
            <CollapsibleTrigger asChild >
              <Button variant="ghost" size="sm">
                {isOpen ?<MailX />  :  <MailOpen />}
              </Button>
            </CollapsibleTrigger>
          </div>
          <CollapsibleContent  className="space-y-2 mt-1">
            {contacts.length > 0 ? (
              <ul className="space-y-2">
                {contacts.map((email) => (
                  <li key={email} className="flex items-center justify-between">
                    <span>{email}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveEmail(email)}
                    >
                      <Trash2 className="h-4 w-4 text-red-500" />
                    </Button>
                  </li>
                ))}
              </ul>
            ) : (
              null
            )}
            <div className="flex items-center gap-2">
              <Input
                placeholder="Enter email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              <Button size="sm" onClick={handleAddEmail}>
                <Plus className="h-4 w-4" />
              </Button>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </div>

      <Handle type="source" position={Position.Bottom} isConnectable={isConnectable} />
    </div>
  );
}