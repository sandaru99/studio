
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ACUnit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
    Building, MapPin, Tag, Wrench, Thermometer, Power, Database, Hash, User, Home, Phone, ImageIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/hooks/use-app-store';

interface AcCardProps {
  unit: ACUnit;
  isGrouped?: boolean;
  onClick?: () => void;
}

const gasTypeColorMap: { [key: string]: string } = {
  r22: 'bg-green-100 dark:bg-green-900/50 text-green-800 dark:text-green-200',
  r410a: 'bg-pink-100 dark:bg-pink-900/50 text-pink-800 dark:text-pink-200',
  r32: 'bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200',
};


export function AcCard({ unit, isGrouped = false, onClick }: AcCardProps) {
  const { config } = useAppStore();
  
  const { 
      status, company, companyCity, brand, btu, modelNumber, serialNumber, installLocation, 
      acType, inverter, gasType, customerName, customerAddress, customerContact, mapLocation
  } = unit;
  
  const statusInfo = config.statuses.find(s => s.name === status);
  const statusColor = statusInfo?.color || '#A0A0A0';

  const brandInfo = config.brands.find(b => b.name === brand);

  const gasColorClass = gasTypeColorMap[gasType.toLowerCase()] || '';
  const companyInfo = config.companies.find(c => c.name === company);
  const companyColor = companyInfo?.color || '#A0A0A0';

  const CardComponent = isGrouped ? 'div' : Card;

  const BrandDisplay = () => {
    return <p className="font-bold text-foreground capitalize text-xl">{brand}</p>;
  };

  return (
    <CardComponent 
        className={cn(
            "flex flex-col h-full bg-card", 
            !isGrouped && "transition-shadow duration-300 hover:shadow-xl",
            onClick && "cursor-pointer"
        )}
        style={!isGrouped ? {
            borderWidth: '1px',
            borderColor: companyColor,
            borderTopWidth: '4px',
        } : {}}
        onClick={onClick}
    >
      <CardHeader className={isGrouped ? 'pb-2' : ''}>
        <div className="flex justify-between items-start gap-2">
          <div>
            {!isGrouped && (
                <>
                <CardTitle className="text-lg font-bold capitalize" style={{ color: companyColor }}>{company}</CardTitle>
                <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  <span className="font-bold">{companyCity}</span>
                </CardDescription>
                </>
            )}
            {isGrouped && <BrandDisplay />}
          </div>
          <Badge className="capitalize shrink-0" style={{backgroundColor: statusColor}}>{status}</Badge>
        </div>
      </CardHeader>

      <CardContent className="flex-grow space-y-4 text-sm">
         <div className={cn("flex items-start gap-3 p-3 rounded-lg", !isGrouped && "bg-muted")}>
            { !isGrouped && (
                <div className="bg-primary/10 p-2 rounded-md mt-1">
                    <Tag className="w-5 h-5 text-primary" />
                </div>
            )}
            <div className="text-lg">
                { !isGrouped && <BrandDisplay />}
                <p className="font-bold text-lg">{modelNumber}</p>
                <p className="font-bold flex items-center gap-2 pt-1 text-lg"><Hash className="w-4 h-4"/> {serialNumber}</p>
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
                 <Database className="w-4 h-4" />
                <span>{gasType}</span>
            </div>
        </div>
         <div className="flex items-center gap-2 text-sm text-muted-foreground w-full pt-2">
            <Building className="w-4 h-4" />
            <p className="truncate flex-1" title={installLocation}>{installLocation}</p>
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
       {mapLocation && (
        <CardFooter className="p-4 pt-0">
          <a
            href={mapLocation}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:underline"
          >
            <MapPin className="w-4 h-4" />
            View on Google Maps
          </a>
        </CardFooter>
      )}
    </CardComponent>
  );
}

    