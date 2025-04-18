import React, { createContext, useContext, useState, useEffect } from 'react';

export interface PeriodEntry {
  id: string;
  userId: string;
  date: Date;
  flow: 'light' | 'medium' | 'heavy';
  mood: 'happy' | 'sad' | 'neutral' | 'irritated' | 'energetic' | 'tired';
  symptoms: string[];
  notes: string;
}

interface PeriodTrackerContextType {
  entries: PeriodEntry[];
  addEntry: (entry: Omit<PeriodEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<PeriodEntry>) => void;
  deleteEntry: (id: string) => void;
  getEntriesByUser: (userId: string) => PeriodEntry[];
  getUserStats: (userId: string) => {
    averageCycleLength: number;
    lastPeriodDate: Date | null;
    nextPeriodPrediction: Date | null;
  };
}

const PeriodTrackerContext = createContext<PeriodTrackerContextType | undefined>(undefined);

export const PeriodTrackerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [entries, setEntries] = useState<PeriodEntry[]>(() => {
    const savedEntries = localStorage.getItem('periodEntries');
    return savedEntries ? JSON.parse(savedEntries, (key, value) => {
      if (key === 'date') return new Date(value);
      return value;
    }) : [];
  });

  useEffect(() => {
    localStorage.setItem('periodEntries', JSON.stringify(entries));
  }, [entries]);

  const addEntry = (entry: Omit<PeriodEntry, 'id'>) => {
    const newEntry: PeriodEntry = {
      ...entry,
      id: Math.random().toString(36).substr(2, 9)
    };
    setEntries(prev => [...prev, newEntry]);
  };

  const updateEntry = (id: string, updatedFields: Partial<PeriodEntry>) => {
    setEntries(prev => prev.map(entry => 
      entry.id === id ? { ...entry, ...updatedFields } : entry
    ));
  };

  const deleteEntry = (id: string) => {
    setEntries(prev => prev.filter(entry => entry.id !== id));
  };

  const getEntriesByUser = (userId: string) => {
    return entries.filter(entry => entry.userId === userId);
  };

  const getUserStats = (userId: string) => {
    const userEntries = getEntriesByUser(userId);
    const sortedEntries = [...userEntries].sort((a, b) => b.date.getTime() - a.date.getTime());
    
    let averageCycleLength = 0;
    const lastPeriodDate = sortedEntries[0]?.date ?? null;
    
    if (sortedEntries.length >= 2) {
      const cycleLengths = [];
      for (let i = 1; i < sortedEntries.length; i++) {
        const daysDiff = Math.floor(
          (sortedEntries[i - 1].date.getTime() - sortedEntries[i].date.getTime()) 
          / (1000 * 60 * 60 * 24)
        );
        cycleLengths.push(daysDiff);
      }
      averageCycleLength = Math.round(
        cycleLengths.reduce((sum, length) => sum + length, 0) / cycleLengths.length
      );
    }

    const nextPeriodPrediction = lastPeriodDate && averageCycleLength > 0
      ? new Date(lastPeriodDate.getTime() + averageCycleLength * 24 * 60 * 60 * 1000)
      : null;

    return {
      averageCycleLength,
      lastPeriodDate,
      nextPeriodPrediction
    };
  };

  const value = {
    entries,
    addEntry,
    updateEntry,
    deleteEntry,
    getEntriesByUser,
    getUserStats
  };

  return (
    <PeriodTrackerContext.Provider value={value}>
      {children}
    </PeriodTrackerContext.Provider>
  );
};

export const usePeriodTracker = () => {
  const context = useContext(PeriodTrackerContext);
  if (context === undefined) {
    throw new Error('usePeriodTracker must be used within a PeriodTrackerProvider');
  }
  return context;
};