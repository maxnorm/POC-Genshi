'use client';

import NoAccessPage from "@/components/pages/NoAccessPage";
import { useUser } from "@/contexts/useUser";
import { ROLES } from "@/lib/constants/roles";

function Access({ requiredRoles, children }: { requiredRoles: (keyof typeof ROLES)[], children: React.ReactNode }) {
  const { hasAnyOfRoles } = useUser();

  if (!hasAnyOfRoles(requiredRoles)) {
    return <NoAccessPage />;
  }

  return children;
}

export default Access;