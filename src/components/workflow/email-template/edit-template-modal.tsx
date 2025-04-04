import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useUpdateEmailTemplate } from "@/hooks/email-templates/email-template-hook";
import { useEffect, useState } from "react";

export default function EditTemplateModal({ isOpen, setIsOpen, template, setSelectedTemplateId }:any ) {
    const [editTemplate, setEditTemplate] = useState(template || { name: '', subject: '', body: '' });
    const { mutateAsync: updateEmailTemplate, isPending: isUpdating } = useUpdateEmailTemplate();
  
    useEffect(() => {
      if (template) setEditTemplate(template);
    }, [template]);
  
    const handleUpdateTemplate = async () => {
      try {
        await updateEmailTemplate({ id: template.id, ...editTemplate });
        setSelectedTemplateId(template.id); 
        setIsOpen(false);
      } catch (error) {
        console.error('Error in handleUpdateTemplate:', error);
      }
    };
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader className="mb-6">
            <DialogTitle className="text-2xl text-blue-600">Edit Email Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="edit-template-name">Template Name</Label>
              <Input
                id="edit-template-name"
                value={editTemplate.name}
                onChange={(e) => setEditTemplate({ ...editTemplate, name: e.target.value })}
                placeholder="Enter template name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-template-subject">Subject</Label>
              <Input
                id="edit-template-subject"
                value={editTemplate.subject}
                onChange={(e) => setEditTemplate({ ...editTemplate, subject: e.target.value })}
                placeholder="Enter subject"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-template-body">Body</Label>
              <Textarea
                id="edit-template-body"
                value={editTemplate.body}
                onChange={(e) => setEditTemplate({ ...editTemplate, body: e.target.value })}
                placeholder="Enter email content"
                rows={5}
              />
            </div>
            <Button isLoading={isUpdating} onClick={handleUpdateTemplate} disabled={isUpdating} className="w-full">
            Update Template
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }