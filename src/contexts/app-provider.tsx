
"use client";

import { createContext, useState, useEffect, useCallback, ReactNode } from 'react';
import type { AppState, AppConfig, ACUnit, Company, Status, Brand } from '@/types';

const initialConfig: AppConfig = {
  companies: [
      { name: 'boc', color: '#1E90FF' },
      { name: 'asiri', color: '#32CD32' },
      { name: 'nsb', color: '#FFD700' },
      { name: 'hnb', color: '#FF4500' },
      { name: 'customer', color: '#8A2BE2' }
  ],
  statuses: [
      { name: 'active', color: '#22C55E' },
      { name: 'breakdown', color: '#EF4444' },
      { name: 'removed', color: '#71717A' }
  ],
  brands: [
    { name: 'panasonic' }, { name: 'tcl' }, { name: 'nikai' }, { name: 'lg' }, 
    { name: 'mitsubishi' }, { name: 'techo' }, { name: 'nikura' }, { name: 'toshiba' },
    { name: 'samsung' }, { name: 'frostair' }, { name: 'media' }
  ],
  btuCapacities: [9000, 10000, 12000, 13000, 18000, 24000],
  gasTypes: ['r22', 'r410a', 'r32'],
  acTypes: ['split', 'cassete', 'ceiling suspend', 'chiller cassete'],
  inverterOptions: ['inverter', 'noninverter'],
};

const sampleAcUnits: Omit<ACUnit, 'id'>[] = [];


const initialState: AppState = {
  acUnits: [],
  config: initialConfig,
  getAcUnitById: () => undefined,
  addAcUnit: () => {},
  addAcUnits: () => {},
  removeAcUnit: () => {},
  updateAcUnit: () => {},
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
      const storedState = localStorage.getItem('ac_manager_state');
      if (storedState) {
        const { acUnits: storedUnits, config: storedConfig } = JSON.parse(storedState);
        if (storedUnits && storedUnits.length > 0) {
            setAcUnits(storedUnits);
        } else {
             setAcUnits(sampleAcUnits.map(unit => ({ ...unit, id: new Date().toISOString() + Math.random() })));
        }
        if (storedConfig) {
             // Merge stored config with initial config to prevent missing keys on update
             const mergedConfig = { ...initialConfig, ...storedConfig };
             if (storedConfig.companies && Array.isArray(storedConfig.companies) && storedConfig.companies.every((c: any) => typeof c === 'string' || (typeof c === 'object' && c.name))) {
                const newCompanies = storedConfig.companies.map((company: any) => {
                    const name = typeof company === 'string' ? company : company.name;
                    const existing = initialConfig.companies.find(ic => ic.name === name);
                    return existing || { name, color: company.color ||'#CCCCCC' };
                });
                mergedConfig.companies = newCompanies;
             }
              if (storedConfig.statuses && Array.isArray(storedConfig.statuses) && storedConfig.statuses.every((s: any) => typeof s === 'string' || (typeof s === 'object' && s.name))) {
                const newStatuses = storedConfig.statuses.map((status: any) => {
                    const name = typeof status === 'string' ? status : status.name;
                    const existing = initialConfig.statuses.find(is => is.name === name);
                    return existing || { name, color: status.color || '#CCCCCC' };
                });
                mergedConfig.statuses = newStatuses;
             }
             if (storedConfig.brands && Array.isArray(storedConfig.brands) && storedConfig.brands.every((b: any) => typeof b === 'string' || (typeof b === 'object' && b.name))) {
                const newBrands = storedConfig.brands.map((brand: any) => {
                    if(typeof brand === 'string') return { name: brand };
                    return { name: brand.name }; // only keep name property
                });
                mergedConfig.brands = newBrands;
             }
             setConfig(mergedConfig);
        }
      } else {
         setAcUnits(sampleAcUnits.map(unit => ({ ...unit, id: new Date().toISOString() + Math.random() })));
         setConfig(initialConfig);
      }
    } catch (error) {
      console.error("Failed to load state from localStorage", error);
      // Fallback to sample data if localStorage is corrupt
      setAcUnits(sampleAcUnits.map(unit => ({ ...unit, id: new Date().toISOString() + Math.random() })));
      setConfig(initialConfig);
    }
    setIsInitialized(true);
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        const stateToStore = JSON.stringify({ acUnits, config });
        localStorage.setItem('ac_manager_state', stateToStore);
      } catch (error)
{
        console.error("Failed to save state to localStorage", error);
      }
    }
  }, [acUnits, config, isInitialized]);

  const getAcUnitById = useCallback((id: string) => {
    return acUnits.find(unit => unit.id === id);
  }, [acUnits]);

  const addAcUnit = useCallback((unit: Omit<ACUnit, 'id'>) => {
    setAcUnits(prev => [...prev, { ...unit, id: new Date().toISOString() + Math.random() }]);
  }, []);

  const addAcUnits = useCallback((units: Omit<ACUnit, 'id'>[]) => {
    const newUnits = units.map(unit => ({...unit, id: new Date().toISOString() + Math.random()}));
    setAcUnits(prev => [...prev, ...newUnits]);
  }, []);

  const removeAcUnit = useCallback((id: string) => {
    setAcUnits(prev => prev.filter(unit => unit.id !== id));
  }, []);

  const updateAcUnit = useCallback((id: string, updatedUnit: ACUnit) => {
    setAcUnits(prev => prev.map(unit => unit.id === id ? updatedUnit : unit));
  }, []);

  const updateConfig = useCallback((newConfig: Partial<AppConfig>) => {
    setConfig(prev => ({ ...prev, ...newConfig }));
  }, []);

  const importData = useCallback((data: { acUnits: ACUnit[], config: AppConfig }) => {
    if(data.acUnits) setAcUnits(data.acUnits);
    if(data.config) setConfig(prev => ({...prev, ...data.config}));
  }, []);

  return (
    <AppContext.Provider value={{ acUnits, config, getAcUnitById, addAcUnit, addAcUnits, removeAcUnit, updateAcUnit, updateConfig, importData, isInitialized }}>
      {children}
    </AppContext.Provider>
  );
};

    
