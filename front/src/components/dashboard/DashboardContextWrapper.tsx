"use client";

import { AdminProvider } from "@/contexts/useAdmin";
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

  return (
    <>
      {wrappedChildren}
    </>
  );
}

export default DashboardContextWrapper;