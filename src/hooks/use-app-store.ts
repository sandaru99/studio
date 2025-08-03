"use client";

import { useContext } from 'react';
import { AppContext } from '@/contexts/app-provider';

export const useAppStore = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppProvider');
  }
  return context;
};
