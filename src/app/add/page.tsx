"use client";

import { useState, useEffect } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Separator } from '@/components/ui/separator';
import { useAppStore } from '@/hooks/use-app-store';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { PlusCircle, Trash2, MapPin, Home } from 'lucide-react';

const acUnitSchema = z.object({
  id: z.string().optional(),
  modelNumber: z.string().min(1, 'Model number is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  inverter: z.string().min(1, 'Inverter status is required'),
  brand: z.string().min(1, 'AC brand is required'),
  btu: z.preprocess((val) => Number(val), z.number().min(1, 'BTU capacity is required')),
  gasType: z.string().min(1, 'Gas type is required'),
  acType: z.string().min(1, 'AC type is required'),
  status: z.string().min(1, 'Status is required'),
  installLocation: z.string().min(1, 'Install location is required'),
});

const formSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  companyCity: z.string().min(1, 'Company city is required'),
  mapLocation: z.string().url('Must be a valid Google Maps URL').or(z.literal('')),
  customerName: z.string().optional(),
  customerAddress: z.string().optional(),
  customerContact: z.string().optional(),
  acUnits: z.array(acUnitSchema).min(1, 'At least one AC unit is required'),
}).refine(data => {
    if (data.company === 'customer') {
        return data.customerName && data.customerAddress && data.customerContact;
    }
    return true;
}, {
    message: 'Customer name, address, and contact are required when company is "customer"',
    path: ['customerName'], // You can point to one of the fields
});

type FormData = z.infer<typeof formSchema>;

export default function AddAcPage() {
    const router = useRouter();
    const { toast } = useToast();
    const { addAcUnits, config } = useAppStore();
    const [mapPreviewUrl, setMapPreviewUrl] = useState('');
    
    const form = useForm<FormData>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            company: '',
            companyCity: '',
            mapLocation: '',
            acUnits: [{ modelNumber: '', serialNumber: '', inverter: '', brand: '', btu: 0, gasType: '', acType: '', status: '', installLocation: '' }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'acUnits',
    });

    const companyWatcher = form.watch('company');
    const mapLocationWatcher = form.watch('mapLocation');

    useEffect(() => {
        if(mapLocationWatcher && mapLocationWatcher.includes('@')) {
            const parts = mapLocationWatcher.split('@')[1].split(',');
            if (parts.length >= 2) {
                const lat = parts[0];
                const lng = parts[1];
                setMapPreviewUrl(`https://maps.google.com/maps?q=${lat},${lng}&hl=en&z=14&output=embed`);
            }
        } else {
            setMapPreviewUrl('');
        }
    }, [mapLocationWatcher]);

    const onSubmit = (data: FormData) => {
        const unitsToAdd = data.acUnits.map(unit => ({
            ...unit,
            company: data.company,
            companyCity: data.companyCity,
            mapLocation: data.mapLocation,
            customerName: data.company === 'customer' ? data.customerName : undefined,
            customerAddress: data.company === 'customer' ? data.customerAddress : undefined,
            customerContact: data.company === 'customer' ? data.customerContact : undefined,
        }));
        addAcUnits(unitsToAdd);
        toast({
            title: "Success! 🎉",
            description: `${unitsToAdd.length} AC unit(s) have been added.`,
        });
        router.push('/');
    };

    return (
        <div className="flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6">
            <PageHeader
                title="Add New AC Units"
                description="Fill in the details for the new AC units."
            >
                <Button asChild variant="outline">
                    <Link href="/">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Home
                    </Link>
                </Button>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Common Details</CardTitle>
                            <CardDescription>This information will apply to all AC units added in this form.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField name="company" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company / Owner</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a company" /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {config.companies.map(c => <SelectItem key={c.name} value={c.name} className="capitalize">{c.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField name="companyCity" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company City</FormLabel>
                                        <FormControl><Input placeholder="e.g., Colombo" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <FormField name="mapLocation" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Google Map Location</FormLabel>
                                        <FormControl><Input placeholder="Paste Google Maps URL here" {...field} /></FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                {mapPreviewUrl ? (
                                    <div className="rounded-lg overflow-hidden border">
                                        <iframe width="100%" height="250" style={{ border: 0 }} loading="lazy" allowFullScreen src={mapPreviewUrl}></iframe>
                                    </div>
                                ) : (
                                    <div className="rounded-lg border border-dashed flex items-center justify-center h-[250px]">
                                        <div className="text-center text-muted-foreground">
                                            <MapPin className="mx-auto h-8 w-8 mb-2"/>
                                            <p>Map preview will appear here</p>
                                        </div>
                                    </div>
                                ) }
                            </div>
                             {companyWatcher === 'customer' && (
                                <>
                                <Separator />
                                <CardDescription>Please provide the customer's contact information.</CardDescription>
                                <div className="grid md:grid-cols-3 gap-6">
                                    <FormField name="customerName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField name="customerAddress" control={form.control} render={({ field }) => (<FormItem><FormLabel>Customer Address</FormLabel><FormControl><Input placeholder="123 Main St, Colombo" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                    <FormField name="customerContact" control={form.control} render={({ field }) => (<FormItem><FormLabel>Customer Contact</FormLabel><FormControl><Input placeholder="0771234567" {...field} /></FormControl><FormMessage /></FormItem>)} />
                                </div>
                                </>
                            )}
                        </CardContent>
                    </Card>

                    {fields.map((field, index) => (
                        <Card key={field.id} className="relative">
                            <CardHeader>
                                <CardTitle>AC Unit #{index + 1}</CardTitle>
                                <div className="absolute top-4 right-4 flex gap-2">
                                    {fields.length > 1 && (
                                        <Button type="button" variant="destructive" size="icon" onClick={() => remove(index)}>
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Remove Unit</span>
                                        </Button>
                                    )}
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    <FormField name={`acUnits.${index}.modelNumber`} control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Model Number</FormLabel>
                                            <FormControl><Input placeholder="e.g., CS-YN12WKJ" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name={`acUnits.${index}.serialNumber`} control={form.control} render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Serial Number</FormLabel>
                                            <FormControl><Input placeholder="e.g., 12345ABC" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                    <FormField name={`acUnits.${index}.inverter`} control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Inverter/Non-Inverter</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent>{config.inverterOptions.map(i => <SelectItem key={i} value={i} className="capitalize">{i}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField name={`acUnits.${index}.brand`} control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>AC Brand</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger></FormControl><SelectContent>{config.brands.map(b => <SelectItem key={b} value={b}>{b}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField name={`acUnits.${index}.btu`} control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>BTU Capacity</FormLabel><Select onValueChange={field.onChange} defaultValue={String(field.value)}><FormControl><SelectTrigger><SelectValue placeholder="Select capacity" /></SelectTrigger></FormControl><SelectContent>{config.btuCapacities.map(b => <SelectItem key={b} value={String(b)}>{b}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField name={`acUnits.${index}.gasType`} control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Gas Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gas type" /></SelectTrigger></FormControl><SelectContent>{config.gasTypes.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField name={`acUnits.${index}.acType`} control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>AC Type</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select AC type" /></SelectTrigger></FormControl><SelectContent>{config.acTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField name={`acUnits.${index}.status`} control={form.control} render={({ field }) => (
                                        <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} defaultValue={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>{config.statuses.map(s => <SelectItem key={s} value={s} className="capitalize">{s}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                    )} />
                                    <FormField name={`acUnits.${index}.installLocation`} control={form.control} render={({ field }) => (
                                        <FormItem className="lg:col-span-3">
                                            <FormLabel>Install Location</FormLabel>
                                            <FormControl><Textarea placeholder="e.g., 2nd Floor, Manager's Office" {...field} /></FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )} />
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    <div className="flex justify-between items-center">
                        <Button type="button" variant="outline" onClick={() => append({ id: '', modelNumber: '', serialNumber: '', inverter: '', brand: '', btu: 0, gasType: '', acType: '', status: '', installLocation: '' })}>
                            <PlusCircle className="mr-2 h-4 w-4" />
                            Add Another AC
                        </Button>
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Save All AC Units"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
