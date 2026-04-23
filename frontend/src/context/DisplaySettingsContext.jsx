import React, { createContext, useContext, useMemo, useState } from "react";

const DisplaySettingsContext = createContext(null);

export function DisplaySettingsProvider({ children }) {
  const [settings, setSettings] = useState({
    darkMode: false,
    highContrast: false,
    largeText: false,
    language: "es",
  });

  const toggleSetting = (key) => {
    setSettings((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const setLanguage = (language) => {
    setSettings((current) => ({
      ...current,
      language,
    }));
  };

  const textScale = settings.largeText ? 1.12 : 1;

  const value = useMemo(
    () => ({
      settings,
      textScale,
      toggleSetting,
      setLanguage,
    }),
    [settings, textScale],
  );

  return (
    <DisplaySettingsContext.Provider value={value}>
      {children}
    </DisplaySettingsContext.Provider>
  );
}

export const useDisplaySettings = () => {
  const context = useContext(DisplaySettingsContext);

  if (!context) {
    throw new Error("useDisplaySettings must be used inside DisplaySettingsProvider");
  }

  return context;
};

export default DisplaySettingsContext;
