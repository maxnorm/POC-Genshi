
'use client';

import PageHeader from "@/components/dashboard/PageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { useState } from "react";
import { Settings, Layers, Package, Shield, Grid, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";

import PageWrapper from "@/components/dashboard/PageWrapper";
import InventoryTable from "../../../dashboard/inventory/InventoryTable";
import { useInventory } from "@/contexts/useInventory";

function InventoryPage() {
  const { inventory } = useInventory();
  const inventoryStats = [
    {
      title: "Équipements",
      value: inventory.equipment.length,
      change: "équipements actifs",
      icon: Settings,
    },
    {
      title: "Assemblages",
      value: inventory.assemblies.length,
      change: "assemblages composés",
      icon: Layers,
    },
    {
      title: "Pièces",
      value: inventory.pieces.length,
      change: "pièces individuelles",
      icon: Package,
    }
  ];

  return (
    <PageWrapper>
      <PageHeader 
        title="Inventaire" 
        description="Gérez et visualisez l'inventaire des équipements, assemblages et pièces" 
      />
      <DashboardStats stats={inventoryStats} />
      <InventoryTable />
    </PageWrapper>
  );
}

export default InventoryPage;