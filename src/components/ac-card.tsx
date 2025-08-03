import { ACUnit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';

interface AcCardProps {
  unit: ACUnit;
}

const statusColors: { [key: string]: 'default' | 'destructive' | 'secondary' } = {
  active: 'default',
  breakdown: 'destructive',
  removed: 'secondary',
};

export function AcCard({ unit }: AcCardProps) {
  return (
    <Card className="flex flex-col h-full hover:shadow-lg transition-shadow duration-300">
      <CardHeader>
        <div className="flex justify-between items-start">
            <div>
                <CardTitle className="text-lg">{unit.modelNumber}</CardTitle>
                <CardDescription>{unit.brand} - {unit.btu} BTU</CardDescription>
            </div>
          <Badge variant={statusColors[unit.status] || 'secondary'} className="capitalize">{unit.status}</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-grow grid grid-cols-2 gap-2 text-sm">
        <div className="font-semibold text-muted-foreground">Company:</div>
        <div>{unit.company}</div>

        <div className="font-semibold text-muted-foreground">City:</div>
        <div>{unit.companyCity}</div>

        <div className="font-semibold text-muted-foreground">Location:</div>
        <div>{unit.installLocation}</div>
        
        <div className="font-semibold text-muted-foreground">AC Type:</div>
        <div className="capitalize">{unit.acType}</div>
      </CardContent>
    </Card>
  );
}
