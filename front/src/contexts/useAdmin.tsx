"use client";

import { createContext, useContext, useEffect, useCallback, useState, useRef } from "react";
import useUsersFetch from "@/hooks/useUsersFetch";
import useWrite from "@/hooks/useWriteContract";
import { accessManagerAddress, accessManagerABI } from "@/lib/constants/contracts/accessManager";
import { ROLES } from "@/lib/constants/roles";
import { publicClient } from "@/lib/client";

const AdminContext = createContext<any>(null);

/**
 * AdminProvider component
 * This is a context to manage the admin data
 * @param {*} children The children components
 * @returns {Object} The AdminProvider component
 */
const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { allUsers, isLoadingUser, refetchRoleGrantedEvents, refetchRoleRevokedEvents, roleGrantedCount, roleRevokedCount } = useUsersFetch();
  const { write, isSuccess, isPending, error, hash } = useWrite(accessManagerAddress, accessManagerABI);
  const [pendingTransaction, setPendingTransaction] = useState<{ resolve: (value: any) => void; reject: (reason: any) => void } | null>(null);

  // Watch for transaction success/failure
  useEffect(() => {
    if (pendingTransaction && (isSuccess || error)) {
      if (isSuccess) {
        refetchRoleGrantedEvents();
        pendingTransaction.resolve({ success: true, hash });
      } else if (error) {
        pendingTransaction.reject({ success: false, error });
      }
      setPendingTransaction(null);
    }
  }, [isSuccess, error, pendingTransaction, refetchRoleGrantedEvents, hash]);

  const handleAddUser = async (address: string, role: string): Promise<{ success: boolean; hash?: string; error?: any }> => {
    console.log("Adding user:", address, role);
    try {
      await write("grantRole", [ROLES[role as keyof typeof ROLES], address]);
      console.log("Transaction submitted");
      
      // Return a promise that resolves when transaction is confirmed
      return new Promise((resolve, reject) => {
        setPendingTransaction({ resolve, reject });
      });
    } catch (error) {
      console.error("Failed to add user:", error);
      return { success: false, error };
    }
  }

  const exposed = {
    allUsers,
    isLoadingUser,
    roleGrantedCount,
    roleRevokedCount,
    handleAddUser,
    isPending,
  };

  return (
    <AdminContext.Provider value={exposed}>
      {children}
    </AdminContext.Provider>
  );
};

const useAdmin = () => useContext(AdminContext);

export { AdminContext, AdminProvider, useAdmin };