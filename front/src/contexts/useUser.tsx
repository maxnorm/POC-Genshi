"use client";

import { createContext, useContext } from "react";
import { useAccount } from "wagmi";
import useCurrentUserRoles from "@/hooks/user/useCurrentUserRoles";


const UserContext = createContext<any>(null);

/**
 * UserProvider component
 * This is a context to manage the user data
 * @param {*} children The children components
 * @returns {Object} The UserProvider component
 */
const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const { userRoles, hasAnyRole, hasRole, hasAnyOfRoles, hasAllOfRoles, hasMintRole } = useCurrentUserRoles();

  const exposed = {
    address,
    userRoles,
    hasAnyRole,
    hasRole,
    hasAnyOfRoles,
    hasAllOfRoles,
    hasMintRole
  };

  return (
    <UserContext.Provider value={exposed}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { UserContext, UserProvider, useUser };