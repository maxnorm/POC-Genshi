import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Edit, Trash2 } from "lucide-react";
import AddDocumentDialog from "./AddDocmentDialog";
import { DocumentDefinition } from "@/lib/types/Document";
import { COMMON_MIME_TYPES } from "@/lib/constants/commonMimeTypes";

function DocumentCard({template}: {template: any}) {  
  const hasDocuments = template?.documents && template.documents.length > 0;
  
  return (
    <Card>
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-lg font-semibold">
          <FileText className="w-5 h-5" />
          Documents
        </div>
        {template.status === 0 && (
          <AddDocumentDialog templateId={template.id} />
        )}
      </CardTitle>
    </CardHeader>
    <CardContent>
      {hasDocuments ? (
        <div className="space-y-3">
          {template.documents.map((doc: DocumentDefinition, index: number) => (
            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-medium">{doc.name || "Document sans nom"}</span>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    doc.required ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {doc.required ? "Requis" : "Optionnel"}
                  </span>
                </div>
                {doc.allowedMimeTypes && doc.allowedMimeTypes.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {doc.allowedMimeTypes.map((mimeType: string, i: number) => {
                      const mimeTypeInfo = COMMON_MIME_TYPES.find(mt => mt.value === mimeType);
                      return (
                        <span key={i} className="px-3 py-1 bg-genshi-blue/30 text-genshi-blue-secondary rounded-full text-xs">
                          {mimeTypeInfo?.label || mimeType}
                        </span>
                      );
                    })}
                  </div>
                )}
              </div>
              <div className="flex gap-2">
                {/* TODO: Add edit and delete buttons */}
                {/* <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button> */}
                {/* <Button variant="ghost" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button> */}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          <p>Aucun document défini</p>
          <p className="text-sm">Ajoutez des documents pour définir les fichiers requis pour ce modèle</p>
        </div>
      )}
    </CardContent>
  </Card>
  );
}

export default DocumentCard;