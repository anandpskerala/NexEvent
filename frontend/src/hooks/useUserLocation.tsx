import { createContext, useContext, useState } from "react";
import type { UserLocationResult } from "../interfaces/props/modalProps";
import type { Location } from "../interfaces/props/locationModalProps";

const UserLocationContext = createContext<UserLocationResult | undefined>(undefined);

export const UserLocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [location, setLocation] = useState<Location | undefined>();

  return (
    <UserLocationContext.Provider value={{ location, setLocation }}>
      {children}
    </UserLocationContext.Provider>
  );
};

export const useUserLocation = (): UserLocationResult => {
  const context = useContext(UserLocationContext);
  if (!context) {
    throw new Error('useUserLocation must be used within a UserLocationProvider');
  }
  return context;
};