"use client";
import { createContext, useContext, useState } from "react";

const NewOrderContext = createContext<any>(null);

export function NewOrderProvider({ children, initialCount }: any) {
  const [newOrdersCount, setNewOrdersCount] = useState(initialCount || 0);
  return (
    <NewOrderContext.Provider value={{ newOrdersCount, setNewOrdersCount }}>
      {children}
    </NewOrderContext.Provider>
  );
}

export function useNewOrder() {
  return useContext(NewOrderContext);
}
