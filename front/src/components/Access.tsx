'use client';

import NoAccessPage from "@/components/pages/NoAccessPage";
import { useUser } from "@/contexts/useUser";
import { ROLES } from "@/lib/constants/roles";

/**
 * Access component
 * This component is used to check if the user has the required roles to access the page
 * @param {Object} props - The props for the Access component
 * @param {Array} props.requiredRoles - The roles required to access the page
 * @param {React.ReactNode} props.children - The children to render if the user has the required roles
 */
function Access({ requiredRoles, children }: { requiredRoles: (keyof typeof ROLES)[], children: React.ReactNode }) {
  const { hasAnyOfRoles } = useUser();

  if (!hasAnyOfRoles(requiredRoles)) {
    return <NoAccessPage />;
  }

  return children;
}

export default Access;