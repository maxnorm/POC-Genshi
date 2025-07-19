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
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NFTType } from "@/lib/enums/nftType";
import useAddTemplateForm from "@/hooks/forms/useAddTemplateForm";
import LoadingOverlay from "@/components/LoadingOverlay";

function AddTemplateDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const { name,  nftType, handleNameChange, handleTypeChange, isSubmitting, error, handle, resetForm } = useAddTemplateForm();

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
      if (result.templateId) {
        router.push(`/dashboard/templates/${result.templateId}`);
      }
    }
  }

  return (
    <>
    <LoadingOverlay 
    isVisible={isSubmitting}
    message="Ajout du modèle en cours..."
    />
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="genshiSimple" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          {"Ajouter un modèle"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] max-h-[400px]">
        <DialogHeader>
          <DialogTitle>{"Ajouter un modèle"}</DialogTitle>
          <DialogDescription className="text-black">
            {"Entrez le nom du modèle que vous souhaitez ajouter"}
          </DialogDescription>
        </DialogHeader>
        <Input
          id="name"
          placeholder="Nom du modèle"
          value={name}
          onChange={(e) => handleNameChange(e.target.value)}
        />
        <Select value={nftType?.toString()} onValueChange={(value) => handleTypeChange(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Sélectionnez un type de NFT" />
          </SelectTrigger>
          <SelectContent >
            {Object.entries(NFTType)
              .filter(([key, value]) => value !== NFTType.Unknown)
              .map(([key, value]) => (
                <SelectItem key={key} value={value}>
                  {value}
                </SelectItem>
              ))}
          </SelectContent>
        </Select>
        {error && (
          <div className="text-red-500 text-sm mt-2">
            {error}
          </div>
        )}
        <DialogFooter>
          <Button 
            type="submit" 
            onClick={() => handleSubmit()} 
            className="w-full bg-genshi-blue-secondary text-white"
          >
            {isSubmitting ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );
}

export default AddTemplateDialog;