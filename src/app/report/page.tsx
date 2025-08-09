
"use client";

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/hooks/use-app-store';
import { PageHeader } from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Home, FileDown, ArrowUpDown } from 'lucide-react';
import { ACUnit } from '@/types';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';

type SortKey = keyof ACUnit | '';

export default function ReportPage() {
    const { acUnits, isInitialized } = useAppStore();
    const { toast } = useToast();
    const [searchTerm, setSearchTerm] = useState('');
    const [sortKey, setSortKey] = useState<SortKey>('company');
    const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortDirection(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortDirection('asc');
        }
    };

    const sortedAndFilteredUnits = useMemo(() => {
        let units = [...acUnits];

        if (searchTerm) {
            units = units.filter(unit =>
                Object.values(unit).some(value =>
                    String(value).toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }

        if (sortKey) {
            units.sort((a, b) => {
                const aValue = a[sortKey];
                const bValue = b[sortKey];

                if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
                if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
                return 0;
            });
        }

        return units;
    }, [acUnits, searchTerm, sortKey, sortDirection]);

    const exportToCsv = () => {
        if (sortedAndFilteredUnits.length === 0) {
            toast({ variant: 'destructive', title: "No Data", description: "There is no data to export." });
            return;
        }

        const headers = [
            "Company", "City", "Serial Number", "Model Number", "Brand", "BTU", 
            "Gas Type", "AC Type", "Inverter/Non-Inverter", "Status", "Install Location", 
            "Customer Name", "Customer Address", "Customer Contact", "Map Location"
        ];
        
        const rows = sortedAndFilteredUnits.map(unit => [
            unit.company,
            unit.companyCity,
            unit.serialNumber,
            unit.modelNumber,
            unit.brand,
            unit.btu,
            unit.gasType,
            unit.acType,
            unit.inverter,
            unit.status,
            `"${unit.installLocation.replace(/"/g, '""')}"`, // Handle quotes
            unit.customerName || '',
            unit.customerAddress || '',
            unit.customerContact || '',
            unit.mapLocation
        ].join(','));

        const csvContent = "data:text/csv;charset=utf-8," + [headers.join(','), ...rows].join('\n');
        
        const link = document.createElement('a');
        link.setAttribute('href', encodeURI(csvContent));
        link.setAttribute('download', 'ac_unit_report.csv');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        toast({ title: "Export Successful", description: "The AC unit data has been exported to CSV." });
    };

    const renderSortIcon = (key: SortKey) => {
        if (sortKey !== key) {
            return <ArrowUpDown className="ml-2 h-4 w-4 opacity-30" />;
        }
        return sortDirection === 'asc' 
            ? <ArrowUpDown className="ml-2 h-4 w-4" /> 
            : <ArrowUpDown className="ml-2 h-4 w-4" />;
    };
    
    const columns: { key: SortKey; label: string }[] = [
        { key: 'company', label: 'Company' },
        { key: 'companyCity', label: 'City' },
        { key: 'serialNumber', label: 'Serial Number' },
        { key: 'modelNumber', label: 'Model' },
        { key: 'brand', label: 'Brand' },
        { key: 'status', label: 'Status' },
        { key: 'btu', label: 'BTU' },
        { key: 'installLocation', label: 'Install Location' },
    ];

    if (!isInitialized) return <p className="p-8">Loading data...</p>;

    return (
        <div className="flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6">
            <PageHeader
                title="AC Unit Data Report"
                description="A complete list of all AC units in the system."
            >
                <div className="flex items-center gap-2">
                    <Button onClick={exportToCsv} variant="secondary">
                        <FileDown className="mr-2 h-4 w-4" />
                        Export to CSV
                    </Button>
                     <Button asChild variant="outline">
                        <Link href="/">
                            <Home className="mr-2 h-4 w-4" />
                            Back to Home
                        </Link>
                    </Button>
                </div>
            </PageHeader>
            
            <div className="bg-card p-4 rounded-lg border">
                <Input
                    placeholder="Search all fields..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="max-w-sm"
                />
            </div>

            <div className="rounded-lg border overflow-hidden">
                 <div className="overflow-x-auto">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                {columns.map(col => (
                                    <TableHead key={col.key} className="cursor-pointer hover:bg-muted" onClick={() => handleSort(col.key)}>
                                        <div className="flex items-center">
                                            {col.label}
                                            {renderSortIcon(col.key)}
                                        </div>
                                    </TableHead>
                                ))}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {sortedAndFilteredUnits.length > 0 ? (
                                sortedAndFilteredUnits.map(unit => (
                                    <TableRow key={unit.id} className="animate-fade-in" style={{ animationDelay: '150ms' }}>
                                        <TableCell className="font-medium capitalize">{unit.company}</TableCell>
                                        <TableCell>{unit.companyCity}</TableCell>
                                        <TableCell>{unit.serialNumber}</TableCell>
                                        <TableCell>{unit.modelNumber}</TableCell>
                                        <TableCell className="capitalize">{unit.brand}</TableCell>
                                        <TableCell className="capitalize">{unit.status}</TableCell>
                                        <TableCell>{unit.btu}</TableCell>
                                        <TableCell>{unit.installLocation}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={columns.length} className="h-24 text-center">
                                        No results found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}

