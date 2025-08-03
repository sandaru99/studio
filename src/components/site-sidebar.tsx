"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { SidebarHeader, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarFooter, SidebarTrigger } from './ui/sidebar';
import { Home, Plus, Settings, Wind } from 'lucide-react';
import { Button } from './ui/button';
import { Separator } from './ui/separator';

const menuItems = [
  { href: '/', label: 'Home', icon: Home, emoji: '🏠' },
  { href: '/add', label: 'Add AC', icon: Plus, emoji: '➕' },
  { href: '/settings', label: 'Settings', icon: Settings, emoji: '⚙️' },
];

export function SiteSidebar() {
  const pathname = usePathname();

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-primary">
                <Wind className="h-5 w-5 text-primary-foreground" />
            </div>
            <h1 className="text-lg font-semibold text-primary">AirWave</h1>
        </div>
      </SidebarHeader>
      
      <Separator className="my-2" />

      <SidebarMenu className="flex-1 px-4">
        {menuItems.map(item => (
          <SidebarMenuItem key={item.href}>
            <Link href={item.href} passHref>
              <SidebarMenuButton isActive={pathname === item.href}>
                <span className="text-lg">{item.emoji}</span>
                <span>{item.label}</span>
              </SidebarMenuButton>
            </Link>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
      <SidebarFooter className="p-4">
        <div className="md:hidden">
          <SidebarTrigger />
        </div>
      </SidebarFooter>
    </>
  );
}
