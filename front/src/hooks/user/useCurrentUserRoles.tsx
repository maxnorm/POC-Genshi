import { useEffect, useState } from "react";
import { useAccount, usePublicClient } from "wagmi";
import { accessManagerABI, accessManagerAddress } from "@/lib/constants/contracts/accessManager";
import { ROLES } from "@/lib/constants/roles";

/**
 * Hook to manage the current user roles
 * @returns {Object} The current user roles and the loading state
 */
function useCurrentUserRoles() {
  const { address } = useAccount();
  const publicClient = usePublicClient();

  const [userRoles, setUserRoles] = useState<Record<string, boolean>>({});
  const [isLoadingRoles, setIsLoadingRoles] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchRoles() {
      if (!address || !publicClient) {
        setUserRoles({});
        setIsLoadingRoles(false);
        setError(null);
        return;
      }

      setIsLoadingRoles(true);
      setError(null);

      const roleEntries = Object.entries(ROLES);
      const calls = roleEntries.map(([_, roleValue]) => ({
        address: accessManagerAddress,
        abi: accessManagerABI,
        functionName: "hasRole" as const,
        args: [roleValue, address],
      }));

      try {
        const results = await Promise.all(
          calls.map(call => publicClient.readContract(call))
        );

        const newRoles = Object.fromEntries(
          roleEntries.map(([key], idx) => [key, Boolean(results[idx])])
        );

        setUserRoles(newRoles);
      } catch (err) {
        console.error("Failed to fetch roles", err);
        setError(err instanceof Error ? err : new Error("Failed to fetch roles"));
      } finally {
        setIsLoadingRoles(false);
      }
    }

    fetchRoles();
  }, [address]);

  const hasAnyRole = () => Object.values(userRoles).some(Boolean);

  const hasRole = (role: keyof typeof ROLES) => userRoles[role] || false;

  const hasAnyOfRoles = (roles: (keyof typeof ROLES)[]) =>
    roles.some(role => userRoles[role]);

  const hasAllOfRoles = (roles: (keyof typeof ROLES)[]) =>
    roles.every(role => userRoles[role]);

  return { 
    isLoadingRoles, 
    userRoles, 
    error,
    hasAnyRole, 
    hasRole, 
    hasAnyOfRoles, 
    hasAllOfRoles 
  };
}

export default useCurrentUserRoles;