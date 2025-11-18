import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import { AppProvider } from '@/contexts/app-provider';
import { Toaster } from '@/components/ui/toaster';
import { MainLayout } from '@/components/main-layout';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'AC Manager',
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
          <MainLayout>
            {children}
          </MainLayout>
          <Toaster />
        </AppProvider>
      </body>
    </html>
  );
}
