"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

interface OsContextType {
  isOsMode: boolean;
  toggleOsMode: () => void;
  setOsMode: (enabled: boolean) => void;
}

const OsContext = createContext<OsContextType>({
  isOsMode: false,
  toggleOsMode: () => {},
  setOsMode: () => {},
});

export const OsProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOsMode, setIsOsMode] = useState(false);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("portfolio_os_mode");
      if (saved === "true") {
        setIsOsMode(true);
      }
    } catch {
      // Ignore localStorage errors
    }
  }, []);

  const setOsMode = (enabled: boolean) => {
    setIsOsMode(enabled);
    try {
      localStorage.setItem("portfolio_os_mode", enabled ? "true" : "false");
    } catch {
      // Ignore
    }
  };

  const toggleOsMode = () => {
    setOsMode(!isOsMode);
  };

  return (
    <OsContext.Provider value={{ isOsMode, toggleOsMode, setOsMode }}>
      {children}
    </OsContext.Provider>
  );
};

export const useOsMode = () => useContext(OsContext);
