
"use client";

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { ACUnit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
    Building, MapPin, Tag, Wrench, Thermometer, Power, Database, Hash, User, Home, Phone, Link as LinkIcon
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
  const [mapPreviewUrl, setMapPreviewUrl] = useState('');
  const [universalMapLink, setUniversalMapLink] = useState('');
  
  const { 
      status, company, companyCity, brand, btu, modelNumber, serialNumber, installLocation, 
      acType, inverter, gasType, customerName, customerAddress, customerContact, mapLocation
  } = unit;
  
  useEffect(() => {
    if (mapLocation && mapLocation.includes('@')) {
      const parts = mapLocation.split('@')[1]?.split(',');
      if (parts?.length >= 2) {
        const lat = parts[0];
        const lng = parts[1];
        setMapPreviewUrl(`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`);
        setUniversalMapLink(`https://www.google.com/maps/search/?api=1&query=${lat},${lng}`);
      }
    } else {
      setMapPreviewUrl('');
      setUniversalMapLink(mapLocation); // Fallback to original link
    }
  }, [mapLocation]);
  
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
                <div className="inline-block bg-muted px-3 py-1 rounded-md mb-2 border border-black dark:border-white">
                    <CardTitle className="text-lg font-bold capitalize" style={{ color: companyColor }}>{company}</CardTitle>
                </div>
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
      {!isGrouped && mapLocation && (
        <CardFooter className="p-6 pt-0 flex-col gap-4 items-start">
            <div className="flex items-center gap-2 text-sm text-muted-foreground w-full">
                <MapPin className="w-4 h-4" />
                <a href={universalMapLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                    Open in Map App
                </a>
            </div>
            {mapPreviewUrl && (
              <div className="rounded-lg overflow-hidden border w-full h-48">
                  <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={mapPreviewUrl}></iframe>
              </div>
            )}
        </CardFooter>
      )}
    </CardComponent>
  );
}
