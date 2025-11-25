
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from '@/components/ui/card';
import { useAppStore } from '@/hooks/use-app-store';
import { PageHeader } from '@/components/page-header';
import { GroupedAcCard } from '@/components/grouped-ac-card';
import { PlusCircle, Settings, List } from 'lucide-react';
import { ACUnit } from '@/types';
import { AcDetailsDialog } from '@/components/ac-details-dialog';

export default function Home() {
  const { acUnits, config } = useAppStore();
  const [filters, setFilters] = useState({
    company: 'all',
    city: 'all',
    status: 'all',
  });
  const [selectedUnit, setSelectedUnit] = useState<ACUnit | null>(null);

  const handleFilterChange = (filterName: keyof typeof filters) => (value: string) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
  };

  const filteredAcUnits = useMemo(() => {
    return acUnits
      .filter(unit => {
        const companyMatch = filters.company === 'all' || unit.company === filters.company;
        const cityMatch = filters.city === 'all' || unit.companyCity === filters.city;
        const statusMatch = filters.status === 'all' || unit.status === filters.status;
        return companyMatch && cityMatch && statusMatch;
      })
      .sort((a, b) => a.company.localeCompare(b.company) || a.companyCity.localeCompare(b.companyCity));
  }, [acUnits, filters]);

  const groupedUnits = useMemo(() => {
    const groups: { [key: string]: ACUnit[] } = {};
    filteredAcUnits.forEach(unit => {
        const key = `${unit.company}-${unit.companyCity}`;
        if (!groups[key]) {
            groups[key] = [];
        }
        groups[key].push(unit);
    });
    return Object.values(groups);
  }, [filteredAcUnits]);

  const uniqueCompanies = useMemo(() => {
    const companyNames = new Set(acUnits.map(unit => unit.company));
    return Array.from(companyNames).sort();
  }, [acUnits]);

  const uniqueCities = useMemo(() => [...new Set(acUnits.map(unit => unit.companyCity))], [acUnits]);

  const handleCardClick = (unit: ACUnit) => {
    setSelectedUnit(unit);
  }

  const handleDialogClose = () => {
    setSelectedUnit(null);
  }

  return (
    <>
    <div className="flex flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6">
      <PageHeader
        title="Ac Info"
        description="View, filter, and manage all your AC units in one place."
      >
        <div className="flex items-center gap-2 flex-wrap">
          <Button asChild>
            <Link href="/add">
              <PlusCircle className="mr-2 h-4 w-4" />
              Add New AC
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/report">
              <List className="h-4 w-4" />
              <span className="sr-only">Data Report</span>
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link href="/settings">
              <Settings className="h-4 w-4" />
              <span className="sr-only">Settings</span>
            </Link>
          </Button>
        </div>
      </PageHeader>

      <Card className="animate-fade-in-up" style={{ animationDelay: '150ms' }}>
        <CardHeader>
          <CardTitle className="text-xl">Search AC Units</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {/* Filter by Company */}
            <Select onValueChange={handleFilterChange('company')} value={filters.company}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Company" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Companies</SelectItem>
                {uniqueCompanies.map(company => (
                  <SelectItem key={company} value={company} className="capitalize">{company}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by City */}
            <Select onValueChange={handleFilterChange('city')} value={filters.city}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by City" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Cities</SelectItem>
                {uniqueCities.map(city => (
                  <SelectItem key={city} value={city}>{city}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Filter by Status */}
            <Select onValueChange={handleFilterChange('status')} value={filters.status}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                {config.statuses.map(status => (
                  <SelectItem key={status.name} value={status.name} className="capitalize">{status.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      
      {groupedUnits.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {groupedUnits.map((group, index) => (
             <GroupedAcCard key={`${group[0].company}-${group[0].companyCity}-${index}`} units={group} onCardClick={handleCardClick} index={index} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center text-center py-20 rounded-lg border border-dashed animate-fade-in-up" style={{ animationDelay: '300ms' }}>
            <h2 className="text-2xl font-semibold mb-2">No AC Units Found</h2>
            <p className="text-muted-foreground mb-4">
              {acUnits.length > 0 ? "No units match your current filters." : "Get started by adding a new AC unit."}
            </p>
            <Button asChild>
              <Link href="/add">
                <PlusCircle className="mr-2 h-4 w-4" />
                Add Your First AC
              </Link>
            </Button>
        </div>
      )}
    </div>
    <AcDetailsDialog unit={selectedUnit} isOpen={!!selectedUnit} onOpenChange={handleDialogClose} />
    </>
  );
}
