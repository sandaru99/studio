"use client";

import { ACUnit } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AcCard } from "./ac-card";
import { Button } from "./ui/button";
import { Pencil, Trash2 } from "lucide-react";
import { useAppStore } from "@/hooks/use-app-store";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";


interface AcDetailsDialogProps {
    unit: ACUnit | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AcDetailsDialog({ unit, isOpen, onOpenChange }: AcDetailsDialogProps) {
    const router = useRouter();
    const { removeAcUnit } = useAppStore();
    const { toast } = useToast();

    if (!unit) return null;

    const handleDelete = () => {
        removeAcUnit(unit.id);
        toast({
            title: "AC Unit Deleted",
            description: `The unit ${unit.serialNumber} has been successfully removed.`
        })
        onOpenChange(false); // Close the dialog
    }

    const handleEdit = () => {
        router.push(`/edit/${unit.id}`);
        onOpenChange(false);
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-lg">
                <DialogHeader>
                    <DialogTitle>AC Unit Details</DialogTitle>
                    <DialogDescription>
                        Viewing details for Serial Number: {unit.serialNumber}
                    </DialogDescription>
                </DialogHeader>
                
                <div className="py-4">
                    <AcCard unit={unit} />
                </div>
                
                <DialogFooter>
                    <Button variant="outline" onClick={handleEdit}>
                        <Pencil className="w-4 h-4 mr-2" />
                        Edit
                    </Button>
                    <AlertDialog>
                        <AlertDialogTrigger asChild>
                            <Button variant="destructive">
                                <Trash2 className="w-4 h-4 mr-2" />
                                Delete
                            </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                            <AlertDialogHeader>
                            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                AC unit with serial number <span className="font-bold">{unit.serialNumber}</span>.
                            </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={handleDelete}>Continue</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
