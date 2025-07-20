"use client";

import { AdminProvider } from "@/contexts/useAdmin";
import { TemplateProvider } from "@/contexts/useTemplate";
import { InventoryProvider } from "@/contexts/useInventory";
import { useUser } from "@/contexts/useUser";
import { useAccount } from "wagmi";
import NoAccessPage from "../pages/NoAccessPage";

function DashboardContextWrapper({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { hasRole, hasAnyRole, hasAnyOfRoles } = useUser();

  if (address && !hasAnyRole()) {
    return <NoAccessPage hasNoRole={true} />;
  }

  let wrappedChildren = children;

  if (address && hasRole("TEMPLATE_MANAGER")) {
    wrappedChildren = (
      <TemplateProvider>
        {wrappedChildren}
      </TemplateProvider>
    );
  }

  if (address && hasRole("DEFAULT_ADMIN_ROLE")) {
    wrappedChildren = (
      <AdminProvider>
        {wrappedChildren}
      </AdminProvider>
    );
  }

  if (address && hasAnyOfRoles([
    'PIECE_MANAGER', 'PIECE_MINTER', 'PIECE_AUDITOR', 'PIECE_VALIDATOR', 'PIECE_DOCUMENT_MANAGER',
    'ASSEMBLY_MANAGER', 'ASSEMBLY_MINTER', 'ASSEMBLY_AUDITOR', 'ASSEMBLY_VALIDATOR', 'ASSEMBLY_DOCUMENT_MANAGER',
    'EQUIPMENT_MANAGER', 'EQUIPMENT_MINTER', 'EQUIPMENT_AUDITOR', 'EQUIPMENT_VALIDATOR', 'EQUIPMENT_DOCUMENT_MANAGER',
  ])) {
    wrappedChildren = (
      <InventoryProvider>
        {wrappedChildren}
      </InventoryProvider>
    );
  }


  return <>{wrappedChildren}</>;
}

export default DashboardContextWrapper;