import { Button } from "@/components/ui/button";
import { DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Edit, Users, MoreVertical, Plus, Trash, Inbox } from "lucide-react";
import { useState } from "react";
import CreateLeadSourceModal from "./create-lead-source-modal";
import EditLeadSourceModal from "./edit-lead-source-modal";
import DeleteLeadSourceConfirmationModal from "./delete-lead-source-modal";
import { useDeleteLeadSource, useGetLeadSources } from "@/hooks/lead-source/lead-source-hook";

export default function LeadSourceSelectionModal({ setIsModalOpen, selectedLeadSourceId, setSelectedLeadSourceId }: any) {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [leadSourceToDelete, setLeadSourceToDelete] = useState<string | null>(null);
  const [leadSourceToEdit, setLeadSourceToEdit] = useState<{ id: string; name: string; contacts: { name: string; email: string }[] } | null>(null);

  const { data: leadSources, isLoading } = useGetLeadSources();
  const { mutateAsync: deleteLeadSource, isPending: isDeleting } = useDeleteLeadSource();

  const handleDelete = async () => {
    if (leadSourceToDelete) {
      await deleteLeadSource(leadSourceToDelete);
      if (selectedLeadSourceId === leadSourceToDelete) setSelectedLeadSourceId(null);
      setLeadSourceToDelete(null);
      setIsDeleteModalOpen(false);
    }
  };

  return (
    <>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-2xl">Select Lead Source</DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-green-500"></div>
          </div>
        ) : leadSources?.length > 0 ? (
          <div className="space-y-3">
            {leadSources.map((leadSource: any) => (
              <div key={leadSource.id} className="relative">
                <Button
                  variant="outline"
                  className="w-full h-auto py-3 px-4 text-left flex items-center gap-3 hover:bg-green-50"
                  onClick={() => {
                    setSelectedLeadSourceId(leadSource.id); 
                    setIsModalOpen(false);
                  }}
                >
                  <Users className="w-5 h-5 text-green-500" />
                  <div className="flex-1">
                    <p className="font-medium">{leadSource.name}</p>
                    <p className="text-sm text-gray-500">{leadSource.contacts.length} contacts</p>
                  </div>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => { setLeadSourceToEdit(leadSource); setIsEditModalOpen(true); }}>
                      <Edit className="mr-2 h-4 w-4" /> Update
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => { setLeadSourceToDelete(leadSource.id); setIsDeleteModalOpen(true); }}>
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
              Create New Lead Source
            </Button>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-8 space-y-4">
            <Inbox className="w-12 h-12 text-gray-400" />
            <p className="text-lg font-medium text-gray-600">No lead sources yet</p>
            <p className="text-sm text-gray-500 text-center">Create your first lead source to get started</p>
            <Button
              variant="default"
              onClick={() => setIsCreateModalOpen(true)}
            >
              <Plus className="w-5 h-5 mr-2" />
              Create Lead Source
            </Button>
          </div>
        )}
      </DialogContent>

      <CreateLeadSourceModal
        isOpen={isCreateModalOpen}
        setIsOpen={setIsCreateModalOpen}
        setSelectedLeadSourceId={setSelectedLeadSourceId} 
      />
      <EditLeadSourceModal
        isOpen={isEditModalOpen}
        setIsOpen={setIsEditModalOpen}
        leadSource={leadSourceToEdit}
        setSelectedLeadSourceId={setSelectedLeadSourceId} 
      />
      <DeleteLeadSourceConfirmationModal
        isOpen={isDeleteModalOpen}
        setIsOpen={setIsDeleteModalOpen}
        onConfirm={handleDelete}
        isDeleting={isDeleting}
      />
    </>
  );
}