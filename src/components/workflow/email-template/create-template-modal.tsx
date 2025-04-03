import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCreateEmailTemplate } from "@/hooks/email-templates/email-template-hook";
import { useState } from "react";

export default function CreateTemplateModal({ isOpen, setIsOpen, setSelectedTemplateId }: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    setSelectedTemplateId: (template: any) => void;
    
}) {
    const [newTemplate, setNewTemplate] = useState({ name: '', subject: '', body: '' });
    const { mutateAsync: createEmailTemplate, isPending: isCreating } = useCreateEmailTemplate();
  
    const handleCreateTemplate = async () => {
      try {
        const createdTemplate = await createEmailTemplate(newTemplate);
        setSelectedTemplateId(createdTemplate.id); // Only set the ID
        setNewTemplate({ name: '', subject: '', body: '' });
        setIsOpen(false);
      } catch (error) {
        console.error('Error in handleCreateTemplate:', error);
      }
    };
  
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader  className="mb-6">
            <DialogTitle className="text-2xl text-blue-600">Create New Email Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="template-name">Template Name</Label>
              <Input
                id="template-name"
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-subject">Subject</Label>
              <Input
                id="template-subject"
                value={newTemplate.subject}
                onChange={(e) => setNewTemplate({ ...newTemplate, subject: e.target.value })}
                placeholder="Enter subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="template-body">Body</Label>
              <Textarea
                id="template-body"
                value={newTemplate.body}
                onChange={(e) => setNewTemplate({ ...newTemplate, body: e.target.value })}
                placeholder="Enter email content"
                rows={5}
              />
            </div>
            <Button isLoading={isCreating} onClick={handleCreateTemplate} disabled={isCreating} className="w-full">
Save Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }