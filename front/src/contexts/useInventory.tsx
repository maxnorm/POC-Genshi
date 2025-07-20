"use client";

import { createContext, useContext, useState } from "react";

const InventoryContext = createContext<any>(null);

/**
 * InventoryProvider component
 * This is a context to manage the inventory data
 * @param {*} children The children components
 * @returns {Object} The InventoryProvider component
 */
const InventoryProvider = ({ children }: { children: React.ReactNode }) => {
    const [inventory, setInventory] = useState([]);

  const exposed = {
    inventory,
    setInventory,
  };

  return (
    <InventoryContext.Provider value={exposed}>
      {children}
    </InventoryContext.Provider>  
  );
};

const useInventory = () => useContext(InventoryContext);

export { InventoryContext, InventoryProvider, useInventory };