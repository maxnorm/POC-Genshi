import Access from "@/components/Access";
import PageHeader from "@/components/dashboard/PageHeader";
import { Metadata } from "next";
import InventoryPage from "@/components/pages/dashboard/inventory/InventoryPage";

export const metadata: Metadata = {
  title: "Inventory – GENSHI",
  description: `Manage your inventory.`,
  robots: {
    index: false,
    follow: false,
  },
};

function Inventory() {
  return (
    <Access requiredRoles={['PIECE_MANAGER', 'PIECE_MINTER', 'PIECE_AUDITOR', 'PIECE_VALIDATOR', 'PIECE_DOCUMENT_MANAGER',
      'ASSEMBLY_MANAGER', 'ASSEMBLY_MINTER', 'ASSEMBLY_AUDITOR', 'ASSEMBLY_VALIDATOR', 'ASSEMBLY_DOCUMENT_MANAGER',
      'EQUIPMENT_MANAGER', 'EQUIPMENT_MINTER', 'EQUIPMENT_AUDITOR', 'EQUIPMENT_VALIDATOR', 'EQUIPMENT_DOCUMENT_MANAGER',
    ]}>
      <InventoryPage />
    </Access>
  );
}

export default Inventory;