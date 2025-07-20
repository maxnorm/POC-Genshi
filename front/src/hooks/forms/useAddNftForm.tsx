import { useState } from "react";
import { NFTType } from "@/lib/enums/nftType";

function useAddNftForm() {
  const [selectedType, setSelectedType] = useState<NFTType | "">("");
  const [selectedModel, setSelectedModel] = useState<string>("");

  const handleNftTypeChange = (type: NFTType | "") => {
    setSelectedType(type);
  };

  const handleNftModelChange = (model: string) => {
    setSelectedModel(model);
  };

  return {
    selectedType,
    handleNftTypeChange,
    selectedModel,
    handleNftModelChange,
  };
}

export default useAddNftForm;