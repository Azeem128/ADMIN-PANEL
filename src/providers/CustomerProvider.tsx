
// "use client";
// // customerContext.tsx
// import { createContext, PropsWithChildren, useContext, useState } from "react";

// interface CustomerContextType {
//   customerData: any;
//   setCustomerData: React.Dispatch<React.SetStateAction<any>>;
// }

// const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

// export const CustomerProvider: React.FC = ({ children }: PropsWithChildren) => {
//   const [customerData, setCustomerData] = useState<any>(null);

//   return (
//     <CustomerContext.Provider value={{ customerData, setCustomerData }}>
//       {children}
//     </CustomerContext.Provider>
//   );
// };

// export const useCustomerContext = () => {
//   const context = useContext(CustomerContext);
//   if (!context) {
//     throw new Error("useCustomerContext must be used within a CustomerProvider");
//   }
//   return context;
// };



"use client";
// customerContext.tsx
import { createContext, PropsWithChildren, useContext, useState } from "react";

// Define the Customer interface to represent customer data
interface Customer {
  id?: string;
  name?: string;
  email?: string;
  phone?: string | null;
  [key: string]: any; // Allow additional properties for flexibility
}

interface CustomerContextType {
  customerData: Customer | null;
  setCustomerData: React.Dispatch<React.SetStateAction<Customer | null>>;
}

const CustomerContext = createContext<CustomerContextType | undefined>(undefined);

export const CustomerProvider: React.FC<PropsWithChildren> = ({ children }) => {
  const [customerData, setCustomerData] = useState<Customer | null>(null);

  return (
    <CustomerContext.Provider value={{ customerData, setCustomerData }}>
      {children}
    </CustomerContext.Provider>
  );
};

export const useCustomerContext = () => {
  const context = useContext(CustomerContext);
  if (!context) {
    throw new Error("useCustomerContext must be used within a CustomerProvider");
  }
  return context;
};