import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/contexts/app-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/main-layout';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Plus, Settings, List, Wind } from 'lucide-react';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AirWave AC Manager',
  description: 'Manage your AC unit details with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.variable} font-body antialiased`}>
        <AppProvider>
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <div className="mr-4 flex items-center">
                <Link href="/" className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary">
                      <Wind className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <h1 className="text-lg font-semibold text-primary">AirWave</h1>
                </Link>
              </div>
              <nav className="flex items-center gap-4 text-sm lg:gap-6">
                <Button variant="ghost" asChild>
                  <Link href="/">
                    <Home className="mr-2 h-4 w-4" /> Home
                  </Link>
                </Button>
                 <Button variant="ghost" asChild>
                  <Link href="/add">
                    <Plus className="mr-2 h-4 w-4" /> Add AC
                  </Link>
                </Button>
                 <Button variant="ghost" asChild>
                  <Link href="/report">
                    <List className="mr-2 h-4 w-4" /> Data Report
                  </Link>
                </Button>
                 <Button variant="ghost" asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" /> Settings
                  </Link>
                </Button>
              </nav>
            </div>
          </header>
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
