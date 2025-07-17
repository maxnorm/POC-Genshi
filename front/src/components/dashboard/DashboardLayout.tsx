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
import CustomConnectButton from "../CustomConnectButton";

function DashboardLayout({ children }: { children: React.ReactNode }) {

  const navigation = [
    { name: 'Tableau de bord', href: '/dashboard', icon: Home },
    { name: 'Inventaire', href: '/dashboard/inventory', icon: Package },
    { name: 'Modèles', href: '/dashboard/templates', icon: FileText }
  ];

  return (
    <SidebarProvider>
      <div className="flex min-h-screen">
        <Sidebar className="border-r border-genshi-blue-secondary/20">
          <SidebarHeader className="flex flex-col">
            <div className="flex items-center gap-2 px-2 rounded-xl p-1">
              <Image src="/LOGO-GENSHI.png" alt="GENSHI" width={75} height={75} className="w-14 h-14  bg-genshi-blue-secondary rounded-xl"/>
              <div className="w-full flex justify-center">
                <CustomConnectButton />
              </div>
            </div>
          </SidebarHeader>
          <SidebarContent >
            <SidebarGroup>
              <SidebarGroupLabel className="text-genshi-blue-secondary text-md">Navigation</SidebarGroupLabel>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navigation.map((item) => (
                    <SidebarMenuItem key={item.name} className="border-b border-genshi-blue-secondary/20 hover:border-b-0">
                      <SidebarMenuButton asChild >
                        <Link href={item.href}>
                          <item.icon className="h-6 w-6" />
                          <span className="text-md">{item.name}</span>
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          </SidebarContent>
          <SidebarFooter>
            <p className="text-sm text-genshi-blue bg-genshi-blue-secondary px- py-2 rounded-lg text-center font-semibold flex flex-col items-center justify-center">
              <span>GENSHI© {new Date().getFullYear()}</span>
              <span className="text-xs">Tous droits réservés</span>
            </p>
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