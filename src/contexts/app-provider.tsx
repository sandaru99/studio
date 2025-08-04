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

const sampleAcUnits: Omit<ACUnit, 'id'>[] = [
    {
        modelNumber: 'CS-YN12WKJ',
        serialNumber: 'SN-001-PAN',
        inverter: 'inverter',
        brand: 'panasonic',
        btu: 12000,
        gasType: 'r32',
        acType: 'split',
        status: 'active',
        mapLocation: 'https://maps.app.goo.gl/abcdef123456',
        installLocation: 'Main Hall',
        company: 'boc',
        companyCity: 'Colombo',
    },
    {
        modelNumber: 'AR18TYHYEWKNST',
        serialNumber: 'SN-002-SAM',
        inverter: 'inverter',
        brand: 'samsung',
        btu: 18000,
        gasType: 'r410a',
        acType: 'split',
        status: 'active',
        mapLocation: 'https://maps.app.goo.gl/bcdefg234567',
        installLocation: 'CEO Office',
        company: 'asiri',
        companyCity: 'Kandy',
    },
    {
        modelNumber: 'LSU-12HUV',
        serialNumber: 'SN-003-LG',
        inverter: 'noninverter',
        brand: 'lg',
        btu: 12000,
        gasType: 'r22',
        acType: 'cassete',
        status: 'breakdown',
        mapLocation: 'https://maps.app.goo.gl/cdefgh345678',
        installLocation: 'Server Room',
        company: 'nsb',
        companyCity: 'Galle',
    },
    {
        modelNumber: 'MSY-GN18VF',
        serialNumber: 'SN-004-MIT',
        inverter: 'inverter',
        brand: 'mitsubishi',
        btu: 18000,
        gasType: 'r32',
        acType: 'ceiling suspend',
        status: 'removed',
        mapLocation: 'https://maps.app.goo.gl/defghi456789',
        installLocation: 'Old Office, 3rd Floor',
        company: 'hnb',
        companyCity: 'Colombo',
    },
    {
        modelNumber: 'TAC-09CSD',
        serialNumber: 'SN-005-TCL',
        inverter: 'noninverter',
        brand: 'tcl',
        btu: 9000,
        gasType: 'r410a',
        acType: 'split',
        status: 'active',
        mapLocation: 'https://maps.app.goo.gl/efghij567890',
        installLocation: 'Reception Area',
        company: 'boc',
        companyCity: 'Jaffna',
    },
     {
        modelNumber: 'CASA-12-PRO',
        serialNumber: 'SN-006-CUS',
        inverter: 'inverter',
        brand: 'media',
        btu: 12000,
        gasType: 'r32',
        acType: 'split',
        status: 'active',
        mapLocation: 'https://maps.app.goo.gl/fghijk678901',
        installLocation: 'Master Bedroom',
        company: 'customer',
        companyCity: 'Negombo',
        customerName: 'Nimal Perera',
        customerAddress: '12, Sea Street, Negombo',
        customerContact: '0712345678',
    },
];


const initialState: AppState = {
  acUnits: [],
  config: initialConfig,
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
      const storedState = localStorage.getItem('airwave_app_state');
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
             if (storedConfig.companies && Array.isArray(storedConfig.companies) && storedConfig.companies.every((c: any) => typeof c === 'string')) {
                const newCompanies = storedConfig.companies.map((name: string) => {
                    const existing = initialConfig.companies.find(ic => ic.name === name);
                    return existing || { name, color: '#CCCCCC' };
                });
                mergedConfig.companies = newCompanies;
             }
              if (storedConfig.statuses && Array.isArray(storedConfig.statuses) && storedConfig.statuses.every((s: any) => typeof s === 'string')) {
                const newStatuses = storedConfig.statuses.map((name: string) => {
                    const existing = initialConfig.statuses.find(is => is.name === name);
                    return existing || { name, color: '#CCCCCC' };
                });
                mergedConfig.statuses = newStatuses;
             }
             if (storedConfig.brands && Array.isArray(storedConfig.brands) && storedConfig.brands.every((b: any) => typeof b === 'string')) {
                const newBrands = storedConfig.brands.map((name: string) => {
                    return { name };
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
        localStorage.setItem('airwave_app_state', stateToStore);
      } catch (error)
{
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
    <AppContext.Provider value={{ acUnits, config, addAcUnit, addAcUnits, removeAcUnit, updateAcUnit, updateConfig, importData, isInitialized }}>
      {children}
    </AppContext.Provider>
  );
};
