
"use client";

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useAppStore } from '@/hooks/use-app-store';
import { useToast } from '@/hooks/use-toast';
import { PageHeader } from '@/components/page-header';
import { Home } from 'lucide-react';
import { ACUnit } from '@/types';

const acUnitSchema = z.object({
  id: z.string(),
  modelNumber: z.string().min(1, 'Model number is required'),
  serialNumber: z.string().min(1, 'Serial number is required'),
  inverter: z.string().min(1, 'Inverter status is required'),
  brand: z.string().min(1, 'AC brand is required'),
  btu: z.preprocess((val) => Number(val), z.number().min(1, 'BTU capacity is required')),
  gasType: z.string().min(1, 'Gas type is required'),
  acType: z.string().min(1, 'AC type is required'),
  status: z.string().min(1, 'Status is required'),
  installLocation: z.string().min(1, 'Install location is required'),
  company: z.string().min(1, 'Company is required'),
  companyCity: z.string().min(1, 'Company city is required'),
  mapLocation: z.string().url('Must be a valid Google Maps URL').or(z.literal('')),
  customerName: z.string().optional(),
  customerAddress: z.string().optional(),
  customerContact: z.string().optional(),
}).refine(data => {
    if (data.company === 'customer') {
        return data.customerName && data.customerAddress && data.customerContact;
    }
    return true;
}, {
    message: 'Customer name, address, and contact are required when company is "customer"',
    path: ['customerName'],
});

type FormData = z.infer<typeof acUnitSchema>;

export default function EditAcPage() {
    const router = useRouter();
    const params = useParams();
    const { toast } = useToast();
    const { getAcUnitById, updateAcUnit, config, isInitialized } = useAppStore();
    
    const [unit, setUnit] = useState<ACUnit | null>(null);
    const [loadingState, setLoadingState] = useState<'loading' | 'found' | 'not_found'>('loading');

    const id = Array.isArray(params.id) ? params.id[0] : params.id;

    const form = useForm<FormData>({
        resolver: zodResolver(acUnitSchema),
    });

    useEffect(() => {
        if (isInitialized && id) {
            const unitToEdit = getAcUnitById(id);
            if (unitToEdit) {
                setUnit(unitToEdit);
                form.reset(unitToEdit);
                setLoadingState('found');
            } else {
                setLoadingState('not_found');
            }
        }
    }, [isInitialized, id, getAcUnitById, form]);


    const onSubmit = (data: FormData) => {
        updateAcUnit(id, data);
        toast({
            title: "Success! 🎉",
            description: `AC unit ${data.serialNumber} has been updated.`,
        });
        router.push('/modify');
    };

    if (loadingState === 'loading') {
        return (
            <div className="flex-1 flex-col p-8 gap-6">
                 <PageHeader title="Loading AC Unit Data..." description="Please wait while we fetch the details." />
            </div>
        );
    }

    if (loadingState === 'not_found') {
         return (
            <div className="flex-1 flex-col p-8 gap-6">
                 <PageHeader title="AC Unit Not Found" description="The AC unit you are trying to edit does not exist." >
                    <Button asChild variant="outline">
                        <Link href="/modify">
                            Back to Modify Page
                        </Link>
                    </Button>
                 </PageHeader>
            </div>
        );
    }

    return (
        <div className="flex-1 flex-col p-4 md:p-6 lg:p-8 gap-6">
            <PageHeader
                title={`Edit AC Unit: ${unit?.serialNumber}`}
                description="Update the details for this AC unit."
            >
                <Button asChild variant="outline">
                    <Link href="/modify">
                        <Home className="mr-2 h-4 w-4" />
                        Back to Modify List
                    </Link>
                </Button>
            </PageHeader>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>AC Unit Details</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                                <FormField name="company" control={form.control} render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Company / Owner</FormLabel>
                                        <Select onValueChange={field.onChange} value={field.value}>
                                            <FormControl><SelectTrigger><SelectValue placeholder="Select a company" /></SelectTrigger></FormControl>
                                            <SelectContent>{config.companies.map(c => <SelectItem key={c.name} value={c.name} className="capitalize">{c.name}</SelectItem>)}</SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )} />
                                <FormField name="companyCity" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Company City</FormLabel><FormControl><Input placeholder="e.g., Colombo" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="mapLocation" control={form.control} render={({ field }) => (
                                     <FormItem className="lg:col-span-1"><FormLabel>Google Map Location</FormLabel><FormControl><Input placeholder="Paste Google Maps URL here" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 <FormField name="modelNumber" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Model Number</FormLabel><FormControl><Input placeholder="e.g., CS-YN12WKJ" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="serialNumber" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Serial Number</FormLabel><FormControl><Input placeholder="e.g., 12345ABC" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                <FormField name="inverter" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Inverter/Non-Inverter</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger></FormControl><SelectContent>{config.inverterOptions.map(i => <SelectItem key={i} value={i} className="capitalize">{i}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField name="brand" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>AC Brand</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select brand" /></SelectTrigger></FormControl><SelectContent>{config.brands.map(b => <SelectItem key={b.name} value={b.name} className="capitalize">{b.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField name="btu" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>BTU Capacity</FormLabel><Select onValueChange={(v) => field.onChange(Number(v))} value={String(field.value)}><FormControl><SelectTrigger><SelectValue placeholder="Select capacity" /></SelectTrigger></FormControl><SelectContent>{config.btuCapacities.map(b => <SelectItem key={b} value={String(b)}>{b}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField name="gasType" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Gas Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select gas type" /></SelectTrigger></FormControl><SelectContent>{config.gasTypes.map(g => <SelectItem key={g} value={g}>{g}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField name="acType" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>AC Type</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select AC type" /></SelectTrigger></FormControl><SelectContent>{config.acTypes.map(t => <SelectItem key={t} value={t} className="capitalize">{t}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField name="status" control={form.control} render={({ field }) => (
                                    <FormItem><FormLabel>Status</FormLabel><Select onValueChange={field.onChange} value={field.value}><FormControl><SelectTrigger><SelectValue placeholder="Select status" /></SelectTrigger></FormControl><SelectContent>{config.statuses.map(s => <SelectItem key={s.name} value={s.name} className="capitalize">{s.name}</SelectItem>)}</SelectContent></Select><FormMessage /></FormItem>
                                )} />
                                <FormField name="installLocation" control={form.control} render={({ field }) => (
                                    <FormItem className="lg:col-span-3"><FormLabel>Install Location</FormLabel><FormControl><Textarea placeholder="e.g., 2nd Floor, Manager's Office" {...field} /></FormControl><FormMessage /></FormItem>
                                )} />
                                 {form.watch('company') === 'customer' && (
                                    <>
                                        <div className="md:col-span-2 lg:col-span-3 -mb-2"><CardDescription>Please provide the customer's contact information.</CardDescription></div>
                                        <FormField name="customerName" control={form.control} render={({ field }) => (<FormItem><FormLabel>Customer Name</FormLabel><FormControl><Input placeholder="John Doe" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField name="customerAddress" control={form.control} render={({ field }) => (<FormItem><FormLabel>Customer Address</FormLabel><FormControl><Input placeholder="123 Main St, Colombo" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                        <FormField name="customerContact" control={form.control} render={({ field }) => (<FormItem><FormLabel>Customer Contact</FormLabel><FormControl><Input placeholder="0771234567" {...field} value={field.value ?? ''} /></FormControl><FormMessage /></FormItem>)} />
                                    </>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <div className="flex justify-end items-center">
                        <Button type="submit" disabled={form.formState.isSubmitting}>
                            {form.formState.isSubmitting ? "Saving..." : "Update AC Unit"}
                        </Button>
                    </div>
                </form>
            </Form>
        </div>
    );
}
