'use client';

import Link from 'next/link';
import { 
  Home, 
  Package, 
  FileText, 
  Settings,
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
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import Image from "next/image";
import DashboardInset from "./DashboardInset";
import CustomConnectButton from "../CustomConnectButton";
import { useUser } from "@/contexts/useUser";

function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { hasRole, hasAnyOfRoles } = useUser();

  function buildNavigation() {
    const navigation = [
      { name: 'Tableau de bord', href: '/dashboard', icon: Home },
    ]

    if (hasAnyOfRoles(
      [
        'PIECE_MANAGER', 'PIECE_MINTER', 'PIECE_AUDITOR', 'PIECE_VALIDATOR', 'PIECE_DOCUMENT_MANAGER',
        'ASSEMBLY_MANAGER', 'ASSEMBLY_MINTER', 'ASSEMBLY_AUDITOR', 'ASSEMBLY_VALIDATOR', 'ASSEMBLY_DOCUMENT_MANAGER',
        'EQUIPMENT_MANAGER', 'EQUIPMENT_MINTER', 'EQUIPMENT_AUDITOR', 'EQUIPMENT_VALIDATOR', 'EQUIPMENT_DOCUMENT_MANAGER',
      ])) {
      navigation.push({ name: 'Inventaire', href: '/dashboard/inventory', icon: Package });
    }

    if (hasRole('TEMPLATE_MANAGER')) {
      navigation.push({ name: 'Modèles', href: '/dashboard/templates', icon: FileText });
    }

    if (hasAnyOfRoles(
      [
        'PIECE_AUDITOR', 'ASSEMBLY_AUDITOR', 'EQUIPMENT_AUDITOR',
      ])) {
      navigation.push({ name: 'Audit', href: '/dashboard/audit', icon: Shield });
    }

    if (hasRole("DEFAULT_ADMIN_ROLE")) {
      navigation.push({ name: 'Administration', href: '/dashboard/admin', icon: Settings });
    }

    return navigation;
  }

  return (
    <SidebarProvider className="w-full">
      <div className="flex min-h-screen w-full pr-8">
        <Sidebar className="border-r border-genshi-blue-secondary/20">
          <SidebarHeader className="flex flex-col">
            <div className="flex items-center gap-2 px-2 rounded-xl p-1 bg-genshi-blue-secondary rounded-xl border-2 border-genshi-blue">
              <Image src="/LOGO-GENSHI.png" alt="GENSHI" width={75} height={75} className="w-14 h-14"/>
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
                  {buildNavigation().map((item) => (
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
            <p className="text-sm text-genshi-blue bg-genshi-blue-secondary px- py-2 rounded-lg text-center font-semibold flex flex-col items-center justify-center border-2 border-genshi-blue">
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