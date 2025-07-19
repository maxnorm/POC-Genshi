export type AttributeType = "string" | "number" | "date" | "enum";

export type AttributeDefinition = {
  name: string;
  attributeType: AttributeType;
  allowedValues: string[];
  units: string;
  required: boolean;
}

export const parseAttributeTypeToLabel = (attributeType: AttributeType) => {
  switch (attributeType) {
    case "string":
      return "Texte";
    case "number":
      return "Nombre";
    case "date":
      return "Date";
    case "enum":
      return "Choix multiple";
  }
}

