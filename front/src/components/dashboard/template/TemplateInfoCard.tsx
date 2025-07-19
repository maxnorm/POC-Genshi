import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import StatusBadge from "./StatusBadge";
import { parseNFTAddressToType } from "@/lib/enums/nftType";
import { Button } from "@/components/ui/button";
import useTemplateStatusChange from "@/hooks/useTemplateStatusChange";


function TemplateInfoCard({ template }: { template: any }) {
  const { handleStatusButton, isStatusChanging } = useTemplateStatusChange(template);

  const hasAttributesOrDocuments = (template?.attributeKeys?.length > 0 || template?.documentKeys?.length > 0);
  
  return (
    <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Informations du modèle</span>
              <div className="flex items-center gap-2">
                <StatusBadge status={template.status} style="text-sm" />
                {(template.status === 0 || template.status === 1) && hasAttributesOrDocuments && (
                  <Button 
                    variant={"genshiSimple"} 
                    size={"sm"} 
                    className="px-12" 
                    onClick={handleStatusButton}
                    disabled={isStatusChanging}
                  >
                    {isStatusChanging ? "Chargement..." : (template.status === 0 ? "Activer" : "Désactiver")}
                  </Button>
                )}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Nom</label>
                <p className="text-lg font-semibold">{template.templateName}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Type NFT</label>
                <p className="text-lg font-semibold">{parseNFTAddressToType(template.nftContract)}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">ID</label>
                <p className="text-lg font-semibold">#{template.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Contrat NFT</label>
                <p className="text-sm font-mono text-gray-600 truncate">{template.nftContract}</p>
              </div>
            </div>
          </CardContent>
        </Card>
  );
}

export default TemplateInfoCard;