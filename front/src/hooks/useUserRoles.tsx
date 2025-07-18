import { useAccount, useReadContract } from "wagmi";
import { accessManagerABI, accessManagerAddress } from "@/lib/constants/contracts/accessManager";
import { ROLES } from "@/lib/constants/roles";

/**
 * Hook to get the user roles
 * @returns {Object}
 */
function useUserRoles() {
  const { address } = useAccount();

  /**
   * Check if the user has a role
   * @param role - The role to check
   * @returns {Object} - The role data
   */
  function readRole(role: string) {
    const { data, isLoading, error } = useReadContract({
      address: accessManagerAddress,
      abi: accessManagerABI,
      functionName: 'hasRole',
      args: [role, address]
    });
    return { data, isLoading, error };
  }

  /**
   * Object to store the read contract calls for each role
   * @type {Object}
   */
  const roleChecks = Object.fromEntries(
    Object.entries(ROLES).map(([key, value]) => [
      key, readRole(value)
    ])
  );

  /**
   * Check if the user roles are loaded
   * @returns {boolean}
   */
  const isLoadingRoles = Object.values(roleChecks).some(check => check.isLoading);

  /**
   * Object to store the user roles
   * @type {Object}
   */
  const userRoles = Object.fromEntries(
    Object.entries(roleChecks).map(([key, check]) => [
      key,
      check.data || false
    ])
  );

  /**
   * Check if the user has any role
   * @returns {boolean}
   */
  const hasAnyRole = () => Object.values(userRoles).some(role => role);

  /**
   * Check if the user has a specific role
   * @param role - The role to check
   * @returns {boolean}
   */
  const hasRole = (role: keyof typeof ROLES) => userRoles[role];

  /**
   * Check if the user has any of the given roles
   * @param roles - The roles to check
   * @returns {boolean}
   */
  const hasAnyOfRoles = (roles: (keyof typeof ROLES)[]) => 
    roles.some(role => userRoles[role]);

  /**
   * Check if the user has all of the given roles
   * @param roles - The roles to check
   * @returns {boolean}
   */
  const hasAllOfRoles = (roles: (keyof typeof ROLES)[]) => 
    roles.every(role => userRoles[role]);

  return { isLoadingRoles, userRoles, hasAnyRole, hasRole, hasAnyOfRoles, hasAllOfRoles };
}

export default useUserRoles;