
"use client";

import { useRouter } from "next/navigation";
import { ACUnit } from "@/types";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { AcCard } from "./ac-card";
import { Button } from "./ui/button";
import { Trash2 } from "lucide-react";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "./ui/scroll-area";

interface AcDetailsDialogProps {
    unit: ACUnit | null;
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
}

export function AcDetailsDialog({ unit, isOpen, onOpenChange }: AcDetailsDialogProps) {
    const { removeAcUnit, updateAcUnit, config } = useAppStore();
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

    const handleStatusChange = (newStatus: string) => {
        if (unit) {
            const updatedUnit = { ...unit, status: newStatus };
            updateAcUnit(unit.id, updatedUnit);
            toast({
                title: "Status Updated",
                description: `Unit ${unit.serialNumber} status changed to ${newStatus}.`
            })
        }
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="w-[95vw] sm:w-full max-w-lg max-h-[90vh] flex flex-col">
                <DialogHeader>
                    <DialogTitle>AC Unit Details</DialogTitle>
                    <DialogDescription>
                        Viewing details for Serial Number: {unit.serialNumber}
                    </DialogDescription>
                </DialogHeader>
                
                <ScrollArea className="flex-grow pr-6 -mr-6">
                    <div className="py-4">
                        <AcCard unit={unit} />
                    </div>
                </ScrollArea>
                
                <div className="grid gap-4 py-4 pr-6">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Select
                            value={unit.status}
                            onValueChange={handleStatusChange}
                        >
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select a status" />
                            </SelectTrigger>
                            <SelectContent>
                                {config.statuses.map((status) => (
                                <SelectItem key={status.name} value={status.name} className="capitalize">
                                    {status.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter className="sm:justify-end gap-2 pr-6">
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
