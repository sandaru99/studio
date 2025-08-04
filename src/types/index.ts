export type Company = {
  name: string;
  color: string;
};

export type Status = {
  name: string;
  color: string;
};

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
  removeAcUnit: (id: string) => void;
  updateAcUnit: (id: string, updatedUnit: ACUnit) => void;
  updateConfig: (newConfig: Partial<AppConfig>) => void;
  importData: (data: { acUnits: ACUnit[], config: AppConfig }) => void;
  isInitialized: boolean;
}

export interface AppConfig {
  companies: Company[];
  statuses: Status[];
  brands: string[];
  btuCapacities: number[];
  gasTypes: string[];
  acTypes: string[];
  inverterOptions: string[];
}
