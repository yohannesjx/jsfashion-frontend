"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";

interface VendureContextValue {
  cart: any;
  setCart: React.Dispatch<React.SetStateAction<any>>;
}

const VendureContext = createContext<VendureContextValue | undefined>(undefined);

export function VendureProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState(null);

  return (
    <VendureContext.Provider value={{ cart, setCart }}>
      {children}
    </VendureContext.Provider>
  );
}

export function useVendure() {
  const context = useContext(VendureContext);
  if (!context) {
    throw new Error("useVendure must be used within a VendureProvider");
  }
  return context;
}
