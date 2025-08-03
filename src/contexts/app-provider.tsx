"use client";

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { AppState, AppConfig, ACUnit } from '@/types';

const initialConfig: AppConfig = {
  companies: ['boc', 'asiri', 'nsb', 'hnb', 'customer'],
  statuses: ['active', 'breakdown', 'removed'],
  brands: ['panasonic', 'tcl', 'nikai', 'lg', 'mitsubishi', 'techo', 'nikura', 'toshiba', 'samsung', 'frostair', 'media'],
  btuCapacities: [9000, 10000, 12000, 13000, 18000, 24000],
  gasTypes: ['r22', 'r410a', 'r32'],
  acTypes: ['split', 'cassete', 'ceiling suspend', 'chiller cassete'],
  inverterOptions: ['inverter', 'noninverter'],
};

const initialState: AppState = {
  acUnits: [],
  config: initialConfig,
  addAcUnit: () => {},
  addAcUnits: () => {},
  updateConfig: () => {},
  importData: () => {},
  isInitialized: false,
};

export const AppContext = createContext<AppState>(initialState);

export const AppProvider = ({ children }: { children: ReactNode }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [acUnits, setAcUnits] = useState<ACUnit[]>([]);
  const [config, setConfig] = useState<AppConfig>(initialConfig);

  useEffect(() => {
    try {
      const storedState = localStorage.getItem('airwave_app_state');
      if (storedState) {
        const { acUnits: storedUnits, config: storedConfig } = JSON.parse(storedState);
        if (storedUnits) setAcUnits(storedUnits);
        if (storedConfig) {
             // Merge stored config with initial config to prevent missing keys on update
             setConfig(prevConfig => ({ ...prevConfig, ...storedConfig }));
        }
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        const stateToStore = JSON.stringify({ acUnits, config });
        localStorage.setItem('airwave_app_state', stateToStore);
      } catch (error) {
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [acUnits, config, isInitialized]);

  const addAcUnit = useCallback((unit: Omit<ACUnit, 'id'>) => {
    setAcUnits(prev => [...prev, { ...unit, id: new Date().toISOString() + Math.random() }]);
  }, []);

  const addAcUnits = useCallback((units: Omit<ACUnit, 'id'>[]) => {
    const newUnits = units.map(unit => ({...unit, id: new Date().toISOString() + Math.random()}));
    setAcUnits(prev => [...prev, ...newUnits]);
  }, []);

  const updateConfig = useCallback((newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const importData = useCallback((data: { acUnits: ACUnit[], config: AppConfig }) => {
    if(data.acUnits) setAcUnits(data.acUnits);
    if(data.config) setConfig(prev => ({...prev, ...data.config}));
  }, []);

  return (
    <AppContext.Provider value={{ acUnits, config, addAcUnit, addAcUnits, updateConfig, importData, isInitialized }}>
      {children}
    </AppContext.Provider>
  );
};
