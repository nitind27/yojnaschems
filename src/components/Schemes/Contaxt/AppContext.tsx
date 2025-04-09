"use client"
import React, { createContext, useContext, useState, ReactNode } from "react";

interface AppContextType {
    inputData: string;
    setInputData: (value: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider = ({ children }: { children: ReactNode }) => {
    const [inputData, setInputData] = useState("");

    return (
        <AppContext.Provider value={{ inputData, setInputData }}>
            {children}
        </AppContext.Provider>
    );
};

export const useAppContext = () => {
    const context = useContext(AppContext);
    if (!context) {
        throw new Error("useAppContext must be used within an AppProvider");
    }
    return context;
};
