"use client";

import { AdminProvider } from "@/contexts/useAdmin";
import { TemplateProvider } from "@/contexts/useTemplate";
import { useUser } from "@/contexts/useUser";
import { useAccount } from "wagmi";
import NoAccessPage from "../pages/NoAccessPage";

function DashboardContextWrapper({ children }: { children: React.ReactNode }) {
  const { address } = useAccount();
  const { hasRole, hasAnyRole } = useUser();

  let wrappedChildren = children;

  if (address && !hasAnyRole()) {
    wrappedChildren = (
      <NoAccessPage hasNoRole={true} />
    );
  }

  if (address && hasRole("DEFAULT_ADMIN_ROLE")) {
    wrappedChildren = (
      <AdminProvider>
        {children}
      </AdminProvider>
    );
  }

  if (address && hasRole("TEMPLATE_MANAGER")) {
    wrappedChildren = (
      <TemplateProvider>
        {children}
      </TemplateProvider>
    );
  }

  return (
    <>
      {wrappedChildren}
    </>
  );
}

export default DashboardContextWrapper;