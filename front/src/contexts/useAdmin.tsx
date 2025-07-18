"use client";

import { createContext, useContext, useEffect, useCallback, useState } from "react";
import useUsersFetch from "@/hooks/useUsersFetch";

const AdminContext = createContext<any>(null);

/**
 * AdminProvider component
 * This is a context to manage the admin data
 * @param {*} children The children components
 * @returns {Object} The AdminProvider component
 */
const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { allUsers, isLoadingUser, refetchRoleGrantedEvents, refetchRoleRevokedEvents } = useUsersFetch();

  console.log(allUsers);

  const exposed = {
    allUsers,
    isLoadingUser,
    refetchRoleGrantedEvents,
    refetchRoleRevokedEvents,
  };

  return (
    <AdminContext.Provider value={exposed}>
      {children}
    </AdminContext.Provider>
  );
};

const useAdmin = () => useContext(AdminContext);

export { AdminContext, AdminProvider, useAdmin };