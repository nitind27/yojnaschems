// context/ScholarshipContext.tsx
"use client"
import React, { createContext, useContext, useState } from 'react';

// Define the shape of the context data
interface ScholarshipContextType {
  selectedScholarship: string;
  setSelectedScholarship: React.Dispatch<React.SetStateAction<string>>;
}

// Create the context with a default value
const ScholarshipContext = createContext<ScholarshipContextType | undefined>(undefined);

// Create a provider component
export const ScholarshipProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [selectedScholarship, setSelectedScholarship] = useState("");

  return (
    <ScholarshipContext.Provider value={{ selectedScholarship, setSelectedScholarship }}>
      {children}
    </ScholarshipContext.Provider>
  );
};

// Custom hook to use the Scholarship context
export const useScholarship = () => {
  const context = useContext(ScholarshipContext);
  if (!context) {
    throw new Error("useScholarship must be used within a ScholarshipProvider");
  }
  return context;
};
