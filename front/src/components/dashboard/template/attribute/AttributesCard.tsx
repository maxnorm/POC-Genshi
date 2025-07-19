import { Card } from "@/components/ui/card";
import { CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tag } from "lucide-react";
import AddAttributeDialog from "./AddAttributeDialog";
import { parseAttributeTypeToLabel } from "@/lib/types/Attribute";

function AttributesCard({template}: {template: any}) { 
    const hasAttributes = template?.attributes && template.attributes.length > 0;
    
    return (
      <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Tag className="w-5 h-5" />
            {"Attributs"}
          </div>
          {template.status === 0 && (
            <AddAttributeDialog templateId={template.id} />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {hasAttributes ? (
          <div className="space-y-3">
            {template.attributes.map((attr: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{attr.name || attr.key}</span>
                    <span className="px-2 py-1 bg-gray-100 text-gray-800 rounded-full text-xs">
                      {parseAttributeTypeToLabel(attr.attributeType)}
                    </span>
                    {attr.required && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                        {"Requis"}
                      </span>
                    )}
                  </div>

                  {attr.units && (
                    <div className="text-sm text-gray-600 mt-1">
                      {"Unités: " + attr.units}
                    </div>
                  )}

                  {attr.allowedValues && attr.allowedValues.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {attr.allowedValues.map((value: any, i: number) => (
                        <span key={i} className="px-3 py-1 bg-genshi-blue/30 text-genshi-blue-secondary rounded-full text-xs">
                          {value}
                        </span>
                      ))}
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
            <p>{"Aucun attribut défini"}</p>
            <p className="text-sm">{"Ajoutez des attributs pour définir les propriétés de ce modèle"}</p>
          </div>
        )}
      </CardContent>
    </Card>
    );
}

export default AttributesCard;