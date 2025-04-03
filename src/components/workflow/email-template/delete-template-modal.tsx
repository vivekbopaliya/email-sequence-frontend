import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export default function DeleteConfirmationModal({ isOpen, setIsOpen, onConfirm, isDeleting }: {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    onConfirm: () => void;
    isDeleting: boolean;
}) {
    return (
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to delete this template?</p>
            <p className="text-sm text-gray-500 mt-2">Deleting this template won't interrupt any running scheduler.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button isLoading={isDeleting} variant="destructive" onClick={onConfirm} disabled={isDeleting}>
            Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }