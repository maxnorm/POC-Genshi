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
import useAddAttributeForm from "@/hooks/forms/useAddAttributeForm";

interface AddAttributeDialogProps {
  templateId: number;
}

function AddAttributeDialog({ templateId }: AddAttributeDialogProps) {
  const [open, setOpen] = useState(false);
  
  const {
    name,
    attributeType,
    allowedValues,
    units,
    required,
    newAllowedValue,
    setNewAllowedValue,
    handleNameChange,
    handleTypeChange,
    handleUnitsChange,
    handleRequiredChange,
    addAllowedValue,
    removeAllowedValue,
    isSubmitting,
    error,
    handle,
    resetForm,
  } = useAddAttributeForm(templateId);

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
          Ajouter un attribut
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px] max-h-[600px] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Ajouter un attribut à ce modèle</DialogTitle>
          <DialogDescription className="text-black">
            Définissez les propriétés de l'attribut
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Nom de l'attribut *</Label>
            <Input
              id="name"
              placeholder="ex: Numéro de série, Matériau, Pression..."
              value={name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="flex flex-row gap-2">
            <div className="space-y-2 flex-1">
              <Label htmlFor="type">Type d'attribut *</Label>
              <Select value={attributeType} onValueChange={handleTypeChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionnez un type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="string">Texte</SelectItem>
                  <SelectItem value="number">Nombre</SelectItem>
                  <SelectItem value="date">Date</SelectItem>
                  <SelectItem value="enum">Liste de choix</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 flex-1">
              <Label htmlFor="units">Unités</Label>
              <Input
                id="units"
                placeholder="ex: mm, MPa, °C, N/A..."
                value={units}
                onChange={(e) => handleUnitsChange(e.target.value)}
              />
            </div>
          </div>

          {attributeType === "enum" && (
            <div className="space-y-2">
              <Label>Valeurs autorisées *</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Ajouter une valeur..."
                  value={newAllowedValue}
                  onChange={(e) => setNewAllowedValue(e.target.value)}
                />
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => addAllowedValue(newAllowedValue)}
                  disabled={!newAllowedValue.trim()}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
              
              {allowedValues.length > 0 && (
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {allowedValues.map((value, index) => (
                      <div
                        key={index}
                        className={activeFilterStyle}
                      >
                        {value}
                        <button
                          type="button"
                          onClick={() => removeAllowedValue(index)}
                          className={activeFilterXStyle}
                        >
                          <X className={activeFilterXStyle} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex items-center space-x-2">
            <Checkbox
              id="required"
              checked={required}
              onCheckedChange={handleRequiredChange}
            />
            <Label htmlFor="required">Attribut obligatoire pour la validation du NFT</Label>
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
            disabled={isSubmitting || !name.trim() || (attributeType === "enum" && allowedValues.length === 0)}
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter l'attribut"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AddAttributeDialog;