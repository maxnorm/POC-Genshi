"use client";

import { createContext, useContext } from "react";
import useCurrentUserInventory from "@/hooks/inventory/useCurrentUserInventory";

const InventoryContext = createContext<any>(null);

/**
 * InventoryProvider component
 * This is a context to manage the inventory data
 * @param {*} children The children components
 * @returns {Object} The InventoryProvider component
 */
const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
  const { inventoryNFTs: inventory } = useCurrentUserInventory();

  const exposed = {
    inventory,
  };

  return (
    <InventoryContext.Provider value={exposed}>
      {children}
    </InventoryContext.Provider>  
  );
};

const useInventory = () => useContext(InventoryContext);

export { InventoryContext, InventoryProvider, useInventory };