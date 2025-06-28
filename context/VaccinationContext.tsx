// VaccinationContext.tsx
import React, { ReactNode, createContext, useContext, useState } from 'react';

export type Vaccination = {
    id: string;
    name: string;
    lastDate: string;
    dueDate: string;
    status: 'Pending' | 'Completed';
};

type VaccinationContextType = {
    vaccinations: Vaccination[];
    addVaccination: (vaccination: Vaccination) => void;
    updateStatus: (id: string, status: 'Pending' | 'Completed') => void; 
    deleteVaccination: (id: string) => void;
  };

const VaccinationContext = createContext<VaccinationContextType | undefined>(undefined);

export const VaccinationProvider = ({ children }: { children: ReactNode }) => {
    const [vaccinations, setVaccinations] = useState<Vaccination[]>([]);

    const addVaccination = (vaccination: Vaccination) => {
        setVaccinations((prev) => [...prev, vaccination]);
    };
    const deleteVaccination = (id: string) => {
        setVaccinations((prev) => prev.filter((m) => m.id !== id));
      };
    const updateStatus = (id: string, status: 'Pending' | 'Completed') => {
        setVaccinations((prev) =>
            prev.map((v) =>
                v.id === id ? { ...v, status } : v
            )
        );
    };
    return (
        <VaccinationContext.Provider value={{ vaccinations, addVaccination, updateStatus, deleteVaccination }}>
        {children}
      </VaccinationContext.Provider>
    );
};

export const useVaccinations = (): VaccinationContextType => {
    const context = useContext(VaccinationContext);
    if (!context) {
        throw new Error('useVaccinations must be used within a VaccinationProvider');
    }
    return context;
};
