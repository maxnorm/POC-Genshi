import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { COMMON_MIME_TYPES } from "@/lib/constants/commonMimeTypes";
import useAddDocumentForm from "@/hooks/forms/useAddDocumentForm";

interface AddDocumentDialogProps {
  templateId: number;
}

function AddDocumentDialog({ templateId }: AddDocumentDialogProps) {
  const [open, setOpen] = useState(false);
  
  const {
    name,
    allowedMimeTypes,
    required,
    handleNameChange,
    handleRequiredChange,
    addMimeType,
    removeMimeType,
    isSubmitting,
    error,
    handle,
    resetForm,
  } = useAddDocumentForm(templateId);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      resetForm();
    }
  };

  const handleSubmit = async () => {
    const result = await handle();
    if (result?.success) {
      setOpen(false);
    }
  };

  const activeFilterStyle = "inline-flex items-center gap-1 px-4 py-1 bg-genshi-blue/50 text-genshi-blue-secondary text-xs rounded-full";
  const activeFilterXStyle = "h-3 w-3 hover:h-4 hover:w-4 transition-all duration-200 hover:text-genshi-blue-secondary";

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="genshiSimple">
          <Plus className="w-4 h-4 mr-2" />
          Ajouter un document
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un document à ce modèle</DialogTitle>
          <DialogDescription className="text-black">
            Définissez les propriétés du document
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom du document *</Label>
            <Input
              id="name"
              placeholder="ex: Certificat de matériau, Test de pression, Rapport d'inspection..."
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Types MIME autorisés *</Label>
            <Select onValueChange={(value) => addMimeType(COMMON_MIME_TYPES.find((mimeType) => mimeType.value === value)!)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sélectionnez des types MIME courants" />
              </SelectTrigger>
              <SelectContent >
                {COMMON_MIME_TYPES.map((mimeType) => (
                  <SelectItem 
                    key={mimeType.value} 
                    value={mimeType.value}
                    disabled={allowedMimeTypes.includes(mimeType.value)}
                    className={cn(
                      "cursor-pointer",
                      allowedMimeTypes.includes(mimeType.value) && "opacity-50",
                      "text-sm"
                    )}
                  >
                    {mimeType.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            {allowedMimeTypes.length > 0 && (
              <div className="space-y-2">
                <Label className="text-sm text-gray-600">Types sélectionnés:</Label>
                <div className="flex flex-wrap gap-2">
                  {allowedMimeTypes.map((mimeTypeValue: string, index: number) => (
                    <div
                      key={index}
                      className={activeFilterStyle}
                    >
                      {COMMON_MIME_TYPES.find((mimeType) => mimeType.value === mimeTypeValue)?.label}
                      <button
                        type="button"
                        onClick={() => removeMimeType(index)}
                        className={activeFilterXStyle}
                      >
                        <X className={activeFilterXStyle} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="text-sm text-gray-500">
              Sélectionnez les types de fichiers autorisés pour ce document
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={required}
              onCheckedChange={handleRequiredChange}
            />
            <Label htmlFor="required">Document obligatoire pour la validation du NFT</Label>
          </div>

          {error && (
            <div className="text-red-500 text-sm">
              {error}
            </div>
          )}
        </div>

        <DialogFooter>
          <Button 
            type="submit" 
            onClick={handleSubmit}
            className="w-full bg-genshi-blue-secondary text-white"
            disabled={isSubmitting || !name.trim() || allowedMimeTypes.length === 0}
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter le document"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddDocumentDialog;