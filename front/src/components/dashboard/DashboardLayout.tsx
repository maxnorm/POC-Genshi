'use client';

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount } from 'wagmi';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { 
  Home, 
  Package, 
  FileText, 
  Settings,
  BarChart3,
  Users,
  Shield,
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Image from "next/image";
import DashboardInset from "./DashboardInset";

function DashboardLayout({ children }: { children: React.ReactNode }) {

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Inventory', href: '/dashboard/inventory', icon: Package },
    { name: 'Templates', href: '/dashboard/templates', icon: FileText }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar>
          <SidebarHeader className="flex flex-col">
            <div className="flex items-center gap-2 px-2 bg-genshi-blue-secondary rounded-xl p-1">
              <Image src="/LOGO-GENSHI.png" alt="GENSHI" width={75} height={75} className="w-12 h-12" />
              <span className="text-xl font-bold text-genshi-blue">GENSHI</span>
            </div>
            <ConnectButton />
          </SidebarHeader>
          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupLabel className="text-genshi-blue-secondary">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.name} className="">
                      <SidebarMenuButton asChild>
                        <Link href={item.href}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-sm text-muted-foreground">GENSHI© {new Date().getFullYear()} - All rights reserved</p>
          </SidebarFooter>
        </Sidebar>
        <DashboardInset>
          {children}
        </DashboardInset>
      </div>
    </SidebarProvider>
  );
}

export default DashboardLayout;