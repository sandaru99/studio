
"use client";

import { ACUnit } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from './ui/accordion';
import { AcCard } from './ac-card';
import { useAppStore } from '@/hooks/use-app-store';

interface CompanyGroupCardProps {
  companyName: string;
  units: ACUnit[];
}

export function CompanyGroupCard({ companyName, units }: CompanyGroupCardProps) {
    const { config } = useAppStore();
    const companyInfo = config.companies.find(c => c.name === companyName);
    const companyColor = companyInfo?.color || '#A0A0A0';

    return (
        <Card style={{
            borderWidth: '2px',
            borderColor: companyColor,
            borderLeftWidth: '5px',
        }}>
            <Accordion type="single" collapsible defaultValue="item-1">
                <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="p-6 hover:no-underline">
                        <div className="flex justify-between items-center w-full">
                            <div>
                                <h2 className="text-2xl font-bold capitalize" style={{color: companyColor}}>{companyName}</h2>
                                <p className="text-sm text-muted-foreground">{units.length} AC unit(s)</p>
                            </div>
                        </div>
                    </AccordionTrigger>
                    <AccordionContent className="p-6 pt-0">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {units.map(unit => (
                                <AcCard key={unit.id} unit={unit} />
                            ))}
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </Card>
    );
}
