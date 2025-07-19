"use client";

import { AdminProvider } from "@/contexts/useAdmin";
import { TemplateProvider } from "@/contexts/useTemplate";
import { useUser } from "@/contexts/useUser";
import { useAccount } from "wagmi";
import NoAccessPage from "../pages/NoAccessPage";

function DashboardContextWrapper({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { hasRole, hasAnyRole } = useUser();

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

  return <>{wrappedChildren}</>;
}

export default DashboardContextWrapper;