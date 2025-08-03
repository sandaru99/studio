"use client";

import { Sidebar, SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { SiteSidebar } from "./site-sidebar";

export function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <Sidebar>
        <SiteSidebar />
      </Sidebar>
      <SidebarInset className="flex flex-col min-h-screen">
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
