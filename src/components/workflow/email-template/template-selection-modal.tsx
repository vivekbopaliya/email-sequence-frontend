import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useDeleteEmailTemplate, useGetEmailTemplates } from "@/hooks/email-templates/email-template-hook";
import { Edit, Mail, MoreVertical, Plus, Trash, Inbox } from "lucide-react";
import { useState } from "react";
import CreateTemplateModal from "./create-template-modal";
import EditTemplateModal from "./edit-template-modal";
import DeleteConfirmationModal from "./delete-template-modal";

export default function TemplateSelectionModal({ setIsModalOpen, selectedTemplateId, setSelectedTemplateId }: any) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [templateToDelete, setTemplateToDelete] = useState<string | null>(null);
  const [templateToEdit, setTemplateToEdit] = useState<{ id: string; name: string; subject: string; body: string } | null>(null);

  const { data: templates, isLoading } = useGetEmailTemplates();
  const { mutateAsync: deleteEmailTemplate, isPending: isDeleting } = useDeleteEmailTemplate();

  const handleDelete = async () => {
    if (templateToDelete) {
      await deleteEmailTemplate(templateToDelete);
      if (selectedTemplateId === templateToDelete) setSelectedTemplateId(null);
      setTemplateToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">Select Email Template</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : templates?.length > 0 ? (
          <div className="space-y-3">
            {templates.map((template: any) => (
              <div key={template.id} className="relative">
                <Button
                  variant="outline"
                  className="w-full h-auto py-3 px-4 text-left flex items-center gap-3 hover:bg-blue-50"
                  onClick={() => {
                    setSelectedTemplateId(template.id); // Only set the ID
                    setIsModalOpen(false);
                  }}
                >
                  <Mail className="w-5 h-5 text-blue-500" />
                  <div className="flex-1">
                    <p className="font-medium">{template.name}</p>
                    <p className="text-sm text-gray-500">{template.subject}</p>
                  </div>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setTemplateToEdit(template); setIsEditModalOpen(true); }}>
                      <Edit className="mr-2 h-4 w-4" /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setTemplateToDelete(template.id); setIsDeleteModalOpen(true); }}>
                      <Trash className="mr-2 h-4 w-4" /> Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}
            <Button
              variant="default"
              className="w-full mt-4"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create New Template
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Inbox className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-600">No templates yet</p>
            <p className="text-sm text-gray-500 text-center">Create your first email template to get started</p>
            <Button
              variant="default"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Template
            </Button>
          </div>
        )}
      </DialogContent>

      <CreateTemplateModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        setSelectedTemplateId={setSelectedTemplateId} // Updated prop name
      />
      <EditTemplateModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        template={templateToEdit}
        setSelectedTemplateId={setSelectedTemplateId} // Updated prop name
      />
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}