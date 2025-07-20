
'use client';

import PageHeader from "@/components/dashboard/PageHeader";
import DashboardStats from "@/components/dashboard/DashboardStats";
import { useState } from "react";
import { Settings, Layers, Package, Shield, Grid, Trees } from "lucide-react";
import { Button } from "@/components/ui/button";

import PageWrapper from "@/components/dashboard/PageWrapper";
import InventoryTable from "../../../dashboard/inventory/InventoryTable";

function InventoryPage() {
  const [viewMode, setViewMode] = useState<'table' | 'tree'>('table');

  const inventoryStats = [
    {
      title: "Équipements",
      value: "0",
      change: "équipements actifs",
      icon: Settings,
    },
    {
      title: "Assemblages",
      value: "0",
      change: "assemblages composés",
      icon: Layers,
    },
    {
      title: "Pièces",
      value: "0",
      change: "pièces individuelles",
      icon: Package,
    },
    {
      title: "En Audit",
      value: "0",
      change: "éléments en cours d'audit",
      icon: Shield,
    }
  ];

  return (
    <PageWrapper>
      <PageHeader 
        title="Inventaire" 
        description="Gérez et visualisez l'inventaire des équipements, assemblages et pièces" 
      />
      
      <DashboardStats stats={inventoryStats} />
      
      <div className="flex items-center gap-2">
        <Button
          variant={viewMode === 'table' ? 'genshi' : 'outline'}
          size="sm"
          onClick={() => setViewMode('table')}
        >
          <Grid className="w-4 h-4 mr-2" />
          Tableau
        </Button>
        <Button
          variant={viewMode === 'tree' ? 'genshi' : 'outline'}
          size="sm"
          onClick={() => setViewMode('tree')}
        >
          <Trees className="w-4 h-4 mr-2" />
          Arborescence
        </Button>
      </div>

      {viewMode === 'table' && (
        <InventoryTable />
      )}
    </PageWrapper>
  );
}

export default InventoryPage;