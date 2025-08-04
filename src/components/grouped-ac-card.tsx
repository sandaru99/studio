import { useState, useEffect } from 'react';
import { ACUnit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from './ui/card';
import { ScrollArea } from './ui/scroll-area';
import { Separator } from './ui/separator';
import { AcCard } from './ac-card';
import { MapPin, Building2 } from 'lucide-react';
import { useAppStore } from '@/hooks/use-app-store';

interface GroupedAcCardProps {
  units: ACUnit[];
  onCardClick: (unit: ACUnit) => void;
}

export function GroupedAcCard({ units, onCardClick }: GroupedAcCardProps) {
  const { config } = useAppStore();
  const firstUnit = units[0];
  const { company, companyCity } = firstUnit;
  const [mapPreviewUrl, setMapPreviewUrl] = useState('');

  const companyInfo = config.companies.find(c => c.name === company);
  const companyColor = companyInfo?.color || '#A0A0A0';

  useEffect(() => {
    if (firstUnit.mapLocation && firstUnit.mapLocation.includes('@')) {
      const parts = firstUnit.mapLocation.split('@')[1]?.split(',');
      if (parts?.length >= 2) {
        const lat = parts[0];
        const lng = parts[1];
        setMapPreviewUrl(`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`);
      }
    } else {
      setMapPreviewUrl('');
    }
  }, [firstUnit.mapLocation]);

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
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg font-bold capitalize" style={{ color: companyColor }}>{company}</CardTitle>
            <CardDescription className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span className="font-bold">{companyCity}</span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 bg-primary/10 text-primary font-bold p-2 rounded-md">
            <Building2 className="w-5 h-5" />
            <span>{units.length} Unit{units.length > 1 ? 's' : ''}</span>
          </div>
        </div>
      </CardHeader>
      
      <ScrollArea className="flex-grow">
        <CardContent className="p-4 pt-0">
          <div className="space-y-4">
            {units.map((unit, index) => (
              <div key={unit.id}>
                {index > 0 && <Separator className="my-4" />}
                <AcCard unit={unit} isGrouped={true} onClick={() => onCardClick(unit)} />
              </div>
            ))}
          </div>
        </CardContent>
      </ScrollArea>
      {firstUnit.mapLocation && (
        <CardFooter className="p-4 pt-0 flex-col items-start gap-4">
           {mapPreviewUrl && (
             <div className="rounded-lg overflow-hidden border w-full h-40">
                <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={mapPreviewUrl}></iframe>
             </div>
           )}
           <a
            href={firstUnit.mapLocation}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 text-sm text-primary hover:underline"
          >
            <MapPin className="w-4 h-4" />
            Google Map Location
          </a>
        </CardFooter>
      )}
    </Card>
  );
}
