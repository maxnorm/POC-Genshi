"use client";

import { createContext, useContext, useEffect, useCallback, useState, useRef } from "react";
import useFetchUsers from "@/hooks/user/useFetchUsers";
import useWrite from "@/hooks/useWriteContract";
import { accessManagerAddress, accessManagerABI } from "@/lib/constants/contracts/accessManager";
import { ROLES } from "@/lib/constants/roles";

const AdminContext = createContext<any>(null);

/**
 * AdminProvider component
 * This is a context to manage the admin data
 * @param {*} children The children components
 * @returns {Object} The AdminProvider component
 */
const AdminProvider = ({ children }: { children: React.ReactNode }) => {
  const { allUsers, isLoadingUser, refetchAll, roleGrantedCount, roleRevokedCount } = useFetchUsers();
  const { write, isSuccess, isPending, error, hash } = useWrite(accessManagerAddress, accessManagerABI);
  const [pendingTransaction, setPendingTransaction] = useState<{ resolve: (value: any) => void; reject: (reason: any) => void } | null>(null);

  useEffect(() => {
    if (pendingTransaction && (isSuccess || error)) {
      if (isSuccess) {
        refetchAll();
        pendingTransaction.resolve({ success: true, hash });
      } else if (error) {
        pendingTransaction.reject({ success: false, error });
      }
      setPendingTransaction(null);
    }
  }, [isSuccess, error, pendingTransaction, hash ]);


  const handleGrantRole = async (address: string, role: string): Promise<{ success: boolean; hash?: string; error?: any }> => {
    try {
      await write("grantRole", [ROLES[role as keyof typeof ROLES], address]);
      
      return new Promise((resolve, reject) => {
        setPendingTransaction({ resolve, reject });
      });
    } catch (error) {
      console.error("Failed to grant role:", error);
      return { success: false, error };
    }
  }

  const exposed = {
    allUsers,
    isLoadingUser,
    roleGrantedCount,
    roleRevokedCount,
    handleGrantRole,
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