export type ACUnit = {
  id: string;
  modelNumber: string;
  serialNumber: string;
  inverter: string;
  brand: string;
  btu: number;
  gasType: string;
  acType: string;
  status: string;
  mapLocation: string;
  installLocation: string;
  company: string;
  companyCity: string;
  customerName?: string;
  customerAddress?: string;
  customerContact?: string;
};

export interface AppState {
  acUnits: ACUnit[];
  config: AppConfig;
  addAcUnit: (unit: Omit<ACUnit, 'id'>) => void;
  addAcUnits: (units: Omit<ACUnit, 'id'>[]) => void;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  importData: (data: { acUnits: ACUnit[], config: AppConfig }) => void;
  isInitialized: boolean;
}

export interface AppConfig {
  companies: string[];
  statuses: string[];
  brands: string[];
  btuCapacities: number[];
  gasTypes: string[];
  acTypes: string[];
  inverterOptions: string[];
}
