import { keccak256, toBytes } from "viem";

export const ROLES = {
  DEFAULT_ADMIN_ROLE: "0x0000000000000000000000000000000000000000000000000000000000000000",
  BASIC_ADMIN: keccak256(toBytes("BASIC_ADMIN")),
  PIECE_MANAGER: keccak256(toBytes("PIECE_MANAGER")),
  PIECE_MINTER: keccak256(toBytes("PIECE_MINTER")),
  PIECE_AUDITOR: keccak256(toBytes("PIECE_AUDITOR")),
  PIECE_VALIDATOR: keccak256(toBytes("PIECE_VALIDATOR")),
  PIECE_DOCUMENT_MANAGER: keccak256(toBytes("PIECE_DOCUMENT_MANAGER")),
  ASSEMBLY_MANAGER: keccak256(toBytes("ASSEMBLY_MANAGER")),
  ASSEMBLY_MINTER: keccak256(toBytes("ASSEMBLY_MINTER")),
  ASSEMBLY_AUDITOR: keccak256(toBytes("ASSEMBLY_AUDITOR")),
  ASSEMBLY_VALIDATOR: keccak256(toBytes("ASSEMBLY_VALIDATOR")),
  ASSEMBLY_DOCUMENT_MANAGER: keccak256(toBytes("ASSEMBLY_DOCUMENT_MANAGER")),
  EQUIPMENT_MANAGER: keccak256(toBytes("EQUIPMENT_MANAGER")),
  EQUIPMENT_MINTER: keccak256(toBytes("EQUIPMENT_MINTER")),
  EQUIPMENT_AUDITOR: keccak256(toBytes("EQUIPMENT_AUDITOR")),
  EQUIPMENT_VALIDATOR: keccak256(toBytes("EQUIPMENT_VALIDATOR")),
  EQUIPMENT_DOCUMENT_MANAGER: keccak256(toBytes("EQUIPMENT_DOCUMENT_MANAGER")),
  TEMPLATE_MANAGER: keccak256(toBytes("TEMPLATE_MANAGER")),
  REGULATOR: keccak256(toBytes("REGULATOR")),
} as const;

export type RoleKey = keyof typeof ROLES;

export const ROLES_LABELS = {
  DEFAULT_ADMIN_ROLE: "Super administrateur",
  BASIC_ADMIN: "Administrateur",
  PIECE_MANAGER: "Gestionnaire de pièce",
  PIECE_MINTER: "Créateur de pièce",
  PIECE_AUDITOR: "Auditeur de pièce",
  PIECE_VALIDATOR: "Validateur de pièce",
  PIECE_DOCUMENT_MANAGER: "Gestionnaire de document de pièce",
  ASSEMBLY_MANAGER: "Gestionnaire d'assemblage",
  ASSEMBLY_MINTER: "Créateur d'assemblage",
  ASSEMBLY_AUDITOR: "Auditeur d'assemblage",
  ASSEMBLY_VALIDATOR: "Validateur d'assemblage",
  ASSEMBLY_DOCUMENT_MANAGER: "Gestionnaire de document d'assemblage",
  EQUIPMENT_MANAGER: "Gestionnaire d'équipement",
  EQUIPMENT_MINTER: "Créateur d'équipement",
  EQUIPMENT_AUDITOR: "Auditeur d'équipement",
  EQUIPMENT_VALIDATOR: "Validateur d'équipement",
  EQUIPMENT_DOCUMENT_MANAGER: "Gestionnaire de document d'équipement",
  TEMPLATE_MANAGER: "Gestionnaire de modèle",
  REGULATOR: "Régulateur",
} as const;