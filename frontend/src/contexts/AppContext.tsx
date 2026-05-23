import React, { createContext, useContext, useState, ReactNode } from 'react';
import { FlightResult, HotelResult, PackageResult } from '../types';
import { NavTab } from '../config/tenants';

interface AppContextType {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  loggedInUser: string | null;
  setLoggedInUser: (user: string | null) => void;
  
  // Search Prefills
  flightPrefillFrom: string;
  setFlightPrefillFrom: (val: string) => void;
  flightPrefillTo: string;
  setFlightPrefillTo: (val: string) => void;
  hotelPrefillDest: string;
  setHotelPrefillDest: (val: string) => void;
  pkgPrefillDest: string;
  setPkgPrefillDest: (val: string) => void;

  // Search Results
  flightResults: FlightResult[];
  setFlightResults: (res: FlightResult[]) => void;
  hotelResults: HotelResult[];
  setHotelResults: (res: HotelResult[]) => void;
  pkgResults: PackageResult[];
  setPkgResults: (res: PackageResult[]) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState<NavTab>('flight');
  const [loggedInUser, setLoggedInUser] = useState<string | null>(null);

  const [flightPrefillFrom, setFlightPrefillFrom] = useState('');
  const [flightPrefillTo, setFlightPrefillTo] = useState('');
  const [hotelPrefillDest, setHotelPrefillDest] = useState('');
  const [pkgPrefillDest, setPkgPrefillDest] = useState('');

  const [flightResults, setFlightResults] = useState<FlightResult[]>([]);
  const [hotelResults, setHotelResults] = useState<HotelResult[]>([]);
  const [pkgResults, setPkgResults] = useState<PackageResult[]>([]);

  return (
    <AppContext.Provider value={{
      activeTab, setActiveTab,
      loggedInUser, setLoggedInUser,
      flightPrefillFrom, setFlightPrefillFrom,
      flightPrefillTo, setFlightPrefillTo,
      hotelPrefillDest, setHotelPrefillDest,
      pkgPrefillDest, setPkgPrefillDest,
      flightResults, setFlightResults,
      hotelResults, setHotelResults,
      pkgResults, setPkgResults
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useAppContext must be used within AppProvider');
  return ctx;
};
