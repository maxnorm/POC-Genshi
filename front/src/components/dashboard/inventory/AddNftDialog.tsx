import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { AlertCircle, Plus } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { NFTType } from "@/lib/enums/nftType";
import LoadingOverlay from "@/components/LoadingOverlay";
import useAddNftForm from "@/hooks/forms/useAddNftForm";
import useFetchActiveTemplates from "@/hooks/templates/useFetchActiveTemplates";
import Link from "next/link";
import { parseNFTTypeToAddress } from "@/lib/enums/nftType";

function AddNftDialog() {  
  const [open, setOpen] = useState(false);
  const { activeTemplates } = useFetchActiveTemplates();
  const [filteredTemplates, setFilteredTemplates] = useState<any[]>([]);
  const {selectedType, handleNftTypeChange, selectedModel, handleNftModelChange } = useAddNftForm();

  const filterByType = (type: NFTType) => {
    const contractAddress = parseNFTTypeToAddress(type);
    if (contractAddress) {
      const filtered = activeTemplates.filter((template) => template.nftContract === contractAddress);
      setFilteredTemplates(filtered);
    } else {
      setFilteredTemplates([]);
    }
  }

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (newOpen) {
      // resetForm();
    }
  };

  const handleSubmit = async () => {
    // const result = await handle(userAddress);
    // if (result.success) {
    //   setOpen(false);
    // }
  }

  return (
    <>  
    <LoadingOverlay 
    isVisible={false}
    message="Création du NFT en cours..."
    />
    <Dialog open={open} onOpenChange={handleOpenChange} >
      <DialogTrigger asChild>
        <Button variant="genshiSimple" onClick={() => setOpen(true)}>
          <Plus className="w-4 h-4" />
          {"Créer un nouveau NFT"}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] max-h-[600px]">
        <DialogHeader>
          <DialogTitle>
            <span className="text-genshi-blue-secondary">{`Créer un nouveau NFT`}</span>
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-2"> 
          <DialogTitle className="text-md">
            {`Sélectionnez le type de NFT`}
          </DialogTitle>
          <div className="grid grid-cols-3 gap-4">
            {Object.keys(NFTType)
              .filter(type => type !== 'Unknown')
              .map((type) => (
                <Button key={type} variant={
                  selectedType === NFTType[type as keyof typeof NFTType] ? "genshi" : "genshiSimple"
                } onClick={() => {
                  const nftType = NFTType[type as keyof typeof NFTType];
                  handleNftTypeChange(nftType);
                  filterByType(nftType);
                }} className="w-full transition-all duration-100">
                  {NFTType[type as keyof typeof NFTType]}
                </Button>
              ))}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <DialogTitle className="text-md">
            {`Ajouter un modèle`}
          </DialogTitle>
          <Select value={selectedModel} onValueChange={handleNftModelChange} disabled={selectedType === ""}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez un modèle" />
            </SelectTrigger>
            <SelectContent>
              {filteredTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id.toString()} className="cursor-pointer">
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-500">
                      #{template.id}
                    </span>
                    <span className="text-sm">{template.name}</span>  
                  </div>
                </SelectItem>
              ))}
              {filteredTemplates.length === 0 && selectedType && (
                <div className="text-sm py-3 px-2 border-t border-gray-200 flex flex-col gap-2">
                  <span className="flex items-center gap-2">
                    <AlertCircle className="w-4 text-red-500" />
                    {`Aucun modèle de données actif trouvé pour le type ${selectedType}.`}
                  </span>
                  <Link href="/dashboard/templates" className="text-genshi-blue-secondary underline">
                    {`Activer un modèle pour ce type`}
                  </Link>
                </div>
              )}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-2">
          <Button 
            type="submit" 
            onClick={() => handleSubmit()} 
            className="w-full bg-genshi-blue-secondary text-white"
            disabled={false}
          >
            {`Créer`}
          </Button>
        </div>
        <DialogFooter>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </>
  );  
}

export default AddNftDialog;