import { ACUnit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
    Building, MapPin, Tag, Wrench, Thermometer, Info, Power, Droplets, Hash, User, Home, Phone, ExternalLink 
} from 'lucide-react';

interface AcCardProps {
  unit: ACUnit;
}

const statusConfig = {
  active: { variant: 'default', label: 'Active' },
  breakdown: { variant: 'destructive', label: 'Breakdown' },
  removed: { variant: 'secondary', label: 'Removed' },
} as const;

export function AcCard({ unit }: AcCardProps) {
  const { 
      status, company, companyCity, brand, btu, modelNumber, serialNumber, installLocation, 
      acType, inverter, gasType, mapLocation, customerName, customerAddress, customerContact 
  } = unit;
  const currentStatus = statusConfig[status as keyof typeof statusConfig] || statusConfig.removed;

  return (
    <Card className="flex flex-col h-full hover:shadow-xl transition-shadow duration-300 bg-card">
      <CardHeader>
        <div className="flex justify-between items-start gap-2">
          <div>
            <CardTitle className="text-lg font-bold text-primary capitalize">{company}</CardTitle>
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
            <div className="flex items-center gap-2 text-muted-foreground">
                <Thermometer className="w-4 h-4" />
                <span>{btu} BTU</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground capitalize">
                 <Wrench className="w-4 h-4" />
                <span>{acType}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground capitalize">
                 <Power className="w-4 h-4" />
                <span>{inverter}</span>
            </div>
             <div className="flex items-center gap-2 text-muted-foreground uppercase">
                 <Droplets className="w-4 h-4" />
                <span>{gasType}</span>
            </div>
        </div>

        {customerName && (
            <>
                <Separator />
                <div className="space-y-2">
                     <h4 className="font-semibold text-primary">Customer Details</h4>
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
             {mapLocation && (
              <a href={mapLocation} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                <ExternalLink className="w-4 h-4" />
              </a>
            )}
        </div>
      </CardFooter>
    </Card>
  );
}
