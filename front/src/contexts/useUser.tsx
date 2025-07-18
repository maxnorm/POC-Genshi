"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useAccount } from "wagmi";
import useCurrentUserRoles from "@/hooks/useCurrentUserRoles";


const UserContext = createContext<any>(null);

/**
 * UserProvider component
 * This is a context to manage the user data
 * @param {*} children The children components
 * @returns {Object} The UserProvider component
 */
const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const { address } = useAccount();
  const { userRoles, hasAnyRole, hasRole, hasAnyOfRoles, hasAllOfRoles } = useCurrentUserRoles();

  const exposed = {
    address,
    userRoles,
    hasAnyRole,
    hasRole,
    hasAnyOfRoles,
    hasAllOfRoles,
  };

  return (
    <UserContext.Provider value={exposed}>
      {children}
    </UserContext.Provider>
  );
};

const useUser = () => useContext(UserContext);

export { UserContext, UserProvider, useUser };