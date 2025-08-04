"use client";

import React, { useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useAppStore } from '@/hooks/use-app-store';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { AppConfig, Company, Status, Brand } from '@/types';
import { Download, Upload, PlusCircle, X, Home, Image as ImageIcon } from 'lucide-react';

type ConfigKey = keyof Omit<AppConfig, 'companies' | 'btuCapacities' | 'inverterOptions' | 'statuses' | 'brands'>;
type ConfigNumberKey = keyof Pick<AppConfig, 'btuCapacities'>;

export default function SettingsPage() {
    const { config, acUnits, updateConfig, importData, isInitialized } = useAppStore();
    const { toast } = useToast();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [newValues, setNewValues] = useState<Record<string, string>>({
        companyName: '',
        companyColor: '#000000',
        statusName: '',
        statusColor: '#000000',
        brandName: '',
        brandLogo: '',
    });

    const handleExport = () => {
        const dataStr = JSON.stringify({ config, acUnits }, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'airwave_ac_data.json';
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
        toast({ title: "✅ Export Successful", description: "Your data has been downloaded." });
    };

    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const text = e.target?.result;
                if (typeof text === 'string') {
                    const parsedData = JSON.parse(text);
                    importData(parsedData);
                    toast({ title: "✅ Import Successful", description: "Your data has been loaded." });
                }
            } catch (error) {
                toast({ variant: "destructive", title: "❌ Import Failed", description: "The file is not a valid JSON file." });
            }
        };
        reader.readAsText(file);
    };

    const handleAddNewCompany = () => {
        const name = newValues.companyName.trim();
        const color = newValues.companyColor;
        if (!name) {
            toast({ variant: "destructive", title: "Invalid Input", description: "Company name cannot be empty." });
            return;
        }

        if (config.companies.some(c => c.name.toLowerCase() === name.toLowerCase())) {
            toast({ variant: "destructive", title: "Duplicate Value", description: `Company "${name}" already exists.` });
            return;
        }

        const newCompany: Company = { name, color };
        const newList = [...config.companies, newCompany].sort((a,b) => a.name.localeCompare(b.name));
        updateConfig({ companies: newList });
        setNewValues(prev => ({ ...prev, companyName: '', companyColor: '#000000' }));
        toast({ title: "👍 Company Added", description: `"${name}" has been added.` });
    }

    const handleRemoveCompany = (companyToRemove: Company) => {
        const newList = config.companies.filter(c => c.name !== companyToRemove.name);
        updateConfig({ companies: newList });
        toast({ title: "👍 Company Removed", description: `"${companyToRemove.name}" has been removed.` });
    }
    
    const handleAddNewBrand = () => {
        const name = newValues.brandName.trim();
        const logo = newValues.brandLogo.trim();
        if (!name) {
            toast({ variant: "destructive", title: "Invalid Input", description: "Brand name cannot be empty." });
            return;
        }

        if (config.brands.some(b => b.name.toLowerCase() === name.toLowerCase())) {
            toast({ variant: "destructive", title: "Duplicate Value", description: `Brand "${name}" already exists.` });
            return;
        }

        const newBrand: Brand = { name, logo: logo || undefined };
        const newList = [...config.brands, newBrand].sort((a,b) => a.name.localeCompare(b.name));
        updateConfig({ brands: newList });
        setNewValues(prev => ({ ...prev, brandName: '', brandLogo: '' }));
        toast({ title: "👍 Brand Added", description: `"${name}" has been added.` });
    }

    const handleRemoveBrand = (brandToRemove: Brand) => {
        const newList = config.brands.filter(b => b.name !== brandToRemove.name);
        updateConfig({ brands: newList });
        toast({ title: "👍 Brand Removed", description: `"${brandToRemove.name}" has been removed.` });
    }

    const handleAddNewStatus = () => {
        const name = newValues.statusName.trim();
        const color = newValues.statusColor;
        if (!name) {
            toast({ variant: "destructive", title: "Invalid Input", description: "Status name cannot be empty." });
            return;
        }

        if (config.statuses.some(s => s.name.toLowerCase() === name.toLowerCase())) {
            toast({ variant: "destructive", title: "Duplicate Value", description: `Status "${name}" already exists.` });
            return;
        }

        const newStatus: Status = { name, color };
        const newList = [...config.statuses, newStatus].sort((a,b) => a.name.localeCompare(b.name));
        updateConfig({ statuses: newList });
        setNewValues(prev => ({ ...prev, statusName: '', statusColor: '#000000' }));
        toast({ title: "👍 Status Added", description: `"${name}" has been added.` });
    }

    const handleRemoveStatus = (statusToRemove: Status) => {
        const newList = config.statuses.filter(s => s.name !== statusToRemove.name);
        updateConfig({ statuses: newList });
        toast({ title: "👍 Status Removed", description: `"${statusToRemove.name}" has been removed.` });
    }


    const handleAddNewValue = (key: ConfigKey | ConfigNumberKey) => {
        const isNumberKey = key === 'btuCapacities';
        const rawValue = newValues[key];
        if (!rawValue) return;

        const value = isNumberKey ? Number(rawValue) : rawValue;
        
        if (isNumberKey && isNaN(value as number)) {
            toast({ variant: "destructive", title: "Invalid Input", description: "Please enter a valid number for BTU capacity." });
            return;
        }
        
        const currentList = Array.isArray(config[key as keyof AppConfig]) ? config[key as keyof AppConfig] as (string | number)[] : [];

        if (currentList.map(String).includes(String(value))) {
            toast({ variant: "destructive", title: "Duplicate Value", description: `"${value}" already exists.` });
            return;
        }

        const newList = [...currentList, value].sort((a, b) => {
            if (typeof a === 'number' && typeof b === 'number') return a - b;
            return String(a).localeCompare(String(b));
        });

        updateConfig({ [key]: newList });
        setNewValues(prev => ({ ...prev, [key]: '' }));
        toast({ title: "👍 Value Added", description: `"${value}" has been added.` });
    };

    const handleRemoveValue = (key: ConfigKey | ConfigNumberKey, valueToRemove: string | number) => {
        const currentList = config[key as keyof AppConfig] as (string | number)[];
        const newList = currentList.filter(item => item !== valueToRemove);
        
        updateConfig({ [key]: newList });
        toast({ title: "👍 Value Removed", description: `"${valueToRemove}" has been removed.` });
    };

    const configSections: { key: ConfigKey, label: string }[] = [
        { key: 'gasTypes', label: 'Gas Types' },
        { key: 'acTypes', label: 'AC Types' },
    ];
    
    const numberConfigSections: { key: ConfigNumberKey, label: string }[] = [
        { key: 'btuCapacities', label: 'BTU Capacities' },
    ];

    if (!isInitialized) {
        return <div className="p-8">Loading settings...</div>;
    }

    return (
        <div className="flex-1 flex-col p-4 md:p-6 lg:p-8 gap-8">
            <PageHeader
                title="Settings"
                description="Manage application data and configurations."
            >
                 <Button asChild variant="outline">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </PageHeader>
            <div className="grid gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Data Management</CardTitle>
                        <CardDescription>Export your current data or import data from a file.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex gap-4">
                        <Button onClick={handleExport}><Download className="mr-2 h-4 w-4" />Export Data</Button>
                        <Button variant="outline" onClick={() => fileInputRef.current?.click()}><Upload className="mr-2 h-4 w-4" />Import Data</Button>
                        <input type="file" ref={fileInputRef} onChange={handleImport} accept=".json" className="hidden" />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Configurations</CardTitle>
                        <CardDescription>Add or remove options for the dropdown menus throughout the app.</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div>
                            <h3 className="font-medium mb-2">Company</h3>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Add new company name"
                                    value={newValues.companyName || ''}
                                    onChange={(e) => setNewValues(prev => ({ ...prev, companyName: e.target.value }))}
                                />
                                <Input
                                    type="color"
                                    value={newValues.companyColor || '#000000'}
                                    onChange={(e) => setNewValues(prev => ({ ...prev, companyColor: e.target.value }))}
                                    className="w-24 p-1"
                                />
                                <Button onClick={handleAddNewCompany}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {config.companies.map(company => (
                                    <div key={company.name} className="bg-muted text-muted-foreground pl-3 pr-2 py-1 rounded-full text-sm flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: company.color }}></span>
                                        <span className="capitalize">{company.name}</span>
                                        <button 
                                            onClick={() => handleRemoveCompany(company)}
                                            className="bg-muted-foreground/20 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                                            aria-label={`Remove ${company.name}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>
                        
                        <div>
                            <h3 className="font-medium mb-2">AC Brands</h3>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Add new brand name"
                                    value={newValues.brandName || ''}
                                    onChange={(e) => setNewValues(prev => ({ ...prev, brandName: e.target.value }))}
                                />
                                <Input
                                    type="text"
                                    placeholder="Add logo URL (optional)"
                                    value={newValues.brandLogo || ''}
                                    onChange={(e) => setNewValues(prev => ({ ...prev, brandLogo: e.target.value }))}
                                />
                                <Button onClick={handleAddNewBrand}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {config.brands.map(brand => (
                                    <div key={brand.name} className="bg-muted text-muted-foreground pl-3 pr-2 py-1 rounded-full text-sm flex items-center gap-2">
                                        {brand.logo ? (
                                            <Image src={brand.logo} alt={brand.name} width={16} height={16} className="object-contain rounded-full bg-white" />
                                        ) : (
                                            <ImageIcon className="w-4 h-4" />
                                        )}
                                        <span className="capitalize">{brand.name}</span>
                                        <button 
                                            onClick={() => handleRemoveBrand(brand)}
                                            className="bg-muted-foreground/20 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                                            aria-label={`Remove ${brand.name}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div>
                            <h3 className="font-medium mb-2">Statuses</h3>
                            <div className="flex gap-2">
                                <Input
                                    type="text"
                                    placeholder="Add new status name"
                                    value={newValues.statusName || ''}
                                    onChange={(e) => setNewValues(prev => ({ ...prev, statusName: e.target.value }))}
                                />
                                <Input
                                    type="color"
                                    value={newValues.statusColor || '#000000'}
                                    onChange={(e) => setNewValues(prev => ({ ...prev, statusColor: e.target.value }))}
                                    className="w-24 p-1"
                                />
                                <Button onClick={handleAddNewStatus}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
                            </div>
                            <div className="flex flex-wrap gap-2 mt-3">
                                {config.statuses.map(status => (
                                    <div key={status.name} className="bg-muted text-muted-foreground pl-3 pr-2 py-1 rounded-full text-sm flex items-center gap-2">
                                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: status.color }}></span>
                                        <span className="capitalize">{status.name}</span>
                                        <button 
                                            onClick={() => handleRemoveStatus(status)}
                                            className="bg-muted-foreground/20 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                                            aria-label={`Remove ${status.name}`}
                                        >
                                            <X className="h-3 w-3" />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {configSections.concat(numberConfigSections as any).map(({ key, label }) => (
                            <div key={key}>
                                <h3 className="font-medium mb-2">{label}</h3>
                                <div className="flex gap-2">
                                    <Input
                                        type={key === 'btuCapacities' ? 'number' : 'text'}
                                        placeholder={`Add new ${label.endsWith('s') ? label.slice(0, -1).toLowerCase() : label.toLowerCase()}`}
                                        value={newValues[key] || ''}
                                        onChange={(e) => setNewValues(prev => ({ ...prev, [key]: e.target.value }))}
                                        onKeyDown={(e) => e.key === 'Enter' && handleAddNewValue(key as any)}
                                    />
                                    <Button onClick={() => handleAddNewValue(key as any)}><PlusCircle className="mr-2 h-4 w-4" />Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    {(config[key as keyof AppConfig] as (string|number)[]).map(item => (
                                        <div key={String(item)} className="bg-muted text-muted-foreground pl-3 pr-2 py-1 rounded-full text-sm flex items-center gap-1.5">
                                            <span>{item}</span>
                                            <button 
                                                onClick={() => handleRemoveValue(key as any, item)}
                                                className="bg-muted-foreground/20 hover:bg-destructive hover:text-destructive-foreground rounded-full p-0.5"
                                                aria-label={`Remove ${item}`}
                                            >
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
