import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export interface User {
  id: string;
  name: string;
  dateOfBirth: Date;
  email?: string;
  avatarColor?: string;
  createdAt: Date;
}

interface UserContextType {
  users: User[];
  currentUserId: string | null;
  setCurrentUserId: (id: string | null) => void;
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => void;
  updateUser: (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => void;
  deleteUser: (id: string) => void;
  getCurrentUser: () => User | null;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const STORAGE_KEY = 'periodTrackerUsers';
const CURRENT_USER_KEY = 'currentPeriodTrackerUser';

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [users, setUsers] = useState<User[]>(() => {
    const savedUsers = localStorage.getItem(STORAGE_KEY);
    return savedUsers ? JSON.parse(savedUsers, (key, value) => {
      if (key === 'dateOfBirth' || key === 'createdAt') return new Date(value);
      return value;
    }) : [];
  });

  const [currentUserId, setCurrentUserId] = useState<string | null>(() => {
    return localStorage.getItem(CURRENT_USER_KEY);
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUserId) {
      localStorage.setItem(CURRENT_USER_KEY, currentUserId);
    } else {
      localStorage.removeItem(CURRENT_USER_KEY);
    }
  }, [currentUserId]);

  const addUser = (userData: Omit<User, 'id' | 'createdAt'>) => {
    const newUser: User = {
      ...userData,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: new Date(),
      avatarColor: userData.avatarColor || `#${Math.floor(Math.random()*16777215).toString(16)}`
    };
    setUsers(prev => [...prev, newUser]);
    toast.success('User added successfully');
    return newUser;
  };

  const updateUser = (id: string, updates: Partial<Omit<User, 'id' | 'createdAt'>>) => {
    setUsers(prev => prev.map(user => 
      user.id === id ? { ...user, ...updates } : user
    ));
    toast.success('User updated successfully');
  };

  const deleteUser = (id: string) => {
    setUsers(prev => prev.filter(user => user.id !== id));
    if (currentUserId === id) {
      setCurrentUserId(null);
    }
    toast.success('User deleted successfully');
  };

  const getCurrentUser = () => {
    return users.find(user => user.id === currentUserId) || null;
  };

  const value = {
    users,
    currentUserId,
    setCurrentUserId,
    addUser,
    updateUser,
    deleteUser,
    getCurrentUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};