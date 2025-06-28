import React, { ReactNode, createContext, useContext, useState } from 'react';

export type Milestone = {
  id: string;
  name: string;
  description: string;
  isOngoing: boolean;
  achievedDate: string;
};

type MilestoneContextType = {
  milestones: Milestone[];
  addMilestone: (milestone: Milestone) => void;
  deleteMilestone: (id: string) => void;
};

const MilestoneContext = createContext<MilestoneContextType | undefined>(undefined);

export const MilestoneProvider = ({ children }: { children: ReactNode }) => {
  const [milestones, setMilestones] = useState<Milestone[]>([]);

  const addMilestone = (milestone: Milestone) => {
    setMilestones((prev) => [...prev, milestone]);
  };

  const deleteMilestone = (id: string) => {
    setMilestones((prev) => prev.filter((m) => m.id !== id));
  };

  return (
    <MilestoneContext.Provider value={{ milestones, addMilestone, deleteMilestone }}>
      {children}
    </MilestoneContext.Provider>
  );
};

export const useMilestones = (): MilestoneContextType => {
  const context = useContext(MilestoneContext);
  if (!context) throw new Error('useMilestones must be used within a MilestoneProvider');
  return context;
};
