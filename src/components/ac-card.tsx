import { ACUnit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
    Building, MapPin, Tag, Wrench, Thermometer, Info, Power, Droplets, Hash, User, Home, Phone
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/hooks/use-app-store';

interface AcCardProps {
  unit: ACUnit;
}

const statusConfig = {
  active: { variant: 'default', label: 'Active' },
  breakdown: { variant: 'destructive', label: 'Breakdown' },
  removed: { variant: 'secondary', label: 'Removed' },
} as const;

const gasTypeColorMap: { [key: string]: string } = {
  r22: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
  r410a: 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200',
  r32: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
};


export function AcCard({ unit }: AcCardProps) {
  const { config } = useAppStore();
  const { 
      status, company, companyCity, brand, btu, modelNumber, serialNumber, installLocation, 
      acType, inverter, gasType, mapLocation, customerName, customerAddress, customerContact 
  } = unit;
  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.removed;
  const gasColorClass = gasTypeColorMap[gasType.toLowerCase()] || '';
  const companyInfo = config.companies.find(c => c.name === company);
  const companyColor = companyInfo?.color || '#A0A0A0';

  return (
    <Card 
        className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 bg-card"
        style={{
            borderWidth: '1px',
            borderColor: companyColor,
            borderTopWidth: '4px',
        }}
    >
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg font-bold capitalize" style={{ color: companyColor }}>{company}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{companyCity}</span>
            </CardDescription>
          </div>
          <Badge variant={currentStatus.variant} className="capitalize shrink-0">{currentStatus.label}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4 text-sm">
         <div className="flex items-start gap-3 p-3 rounded-lg bg-muted">
            <div className="bg-primary/10 p-2 rounded-md mt-1">
                <Tag className="w-5 h-5 text-primary" />
            </div>
            <div>
                <p className="font-semibold text-primary capitalize">{brand}</p>
                <p className="text-muted-foreground">{modelNumber}</p>
                <p className="text-muted-foreground flex items-center gap-2 pt-1"><Hash className="w-3 h-3"/> {serialNumber}</p>
            </div>
        </div>

        <div className="grid grid-cols-2 gap-3 pt-2">
            <div className="flex items-center gap-2 text-muted-foreground p-1 rounded-md">
                <Thermometer className="w-4 h-4" />
                <span>{btu} BTU</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground capitalize p-1 rounded-md">
                 <Wrench className="w-4 h-4" />
                <span>{acType}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground capitalize p-1 rounded-md">
                 <Power className="w-4 h-4" />
                <span>{inverter}</span>
            </div>
             <div className={cn("flex items-center gap-2 font-medium uppercase p-1 rounded-md", gasColorClass)}>
                 <Droplets className="w-4 h-4" />
                <span>{gasType}</span>
            </div>
        </div>

        {customerName && (
            <>
                <Separator />
                <div className="space-y-2 pt-4">
                     <h4 className="font-semibold" style={{color: companyColor}}>Customer Details</h4>
                     <div className="flex items-center gap-2 text-muted-foreground"><User className="w-4 h-4"/> {customerName}</div>
                     <div className="flex items-center gap-2 text-muted-foreground"><Home className="w-4 h-4"/> {customerAddress}</div>
                     <div className="flex items-center gap-2 text-muted-foreground"><Phone className="w-4 h-4"/> {customerContact}</div>
                </div>
            </>
        )}

      </CardContent>

      <Separator />

      <CardFooter className="p-4 flex justify-between items-center">
        <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
            <Building className="w-4 h-4" />
            <p className="truncate flex-1" title={installLocation}>{installLocation}</p>
        </div>
      </CardFooter>
    </Card>
  );
}
