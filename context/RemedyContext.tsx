import React, { ReactNode, createContext, useContext, useState } from 'react';

type Remedy = {
  id: string;
  profileImage: string | null;
  userName: string;
  remedyImage: string;
  remedyText: string;
};

type RemedyContextType = {
  remedies: Remedy[];
  addRemedy: (remedy: Remedy) => void;
};

const RemedyContext = createContext<RemedyContextType | undefined>(undefined);

export const RemedyProvider = ({ children }: { children: ReactNode }) => {
  const [remedies, setRemedies] = useState<Remedy[]>([]);

  const addRemedy = (remedy: Remedy) => {
    setRemedies((prev) => [remedy, ...prev]);
  };

  return (
    <RemedyContext.Provider value={{ remedies, addRemedy }}>
      {children}
    </RemedyContext.Provider>
  );
};

export const useRemedies = () => {
  const context = useContext(RemedyContext);
  if (!context) {
    throw new Error('useRemedies must be used within a RemedyProvider');
  }
  return context;
};
