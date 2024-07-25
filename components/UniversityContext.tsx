'use client'
import React, { createContext, useContext, useState } from 'react';

interface UniversityContextType {
  university: string | null;
  setUniversity: (university: string | null) => void;
}

const UniversityContext = createContext<UniversityContextType | undefined>(undefined);

export const UniversityProvider: React.FC = ({ children }) => {
  const [university, setUniversity] = useState<string | null>(null);

  return (
    <UniversityContext.Provider value={{ university, setUniversity }}>
      {children}
    </UniversityContext.Provider>
  );
};

export const useUniversity = () => useContext(UniversityContext);
