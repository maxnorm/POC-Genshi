'use client';

import { PageHeader } from "@/components/dashboard/PageHeader";
import RolesManagement from "@/components/dashboard/admin/RolesManagement";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function AdminPage() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={cn(
      "space-y-6",
      isCollapsed ? "w-5/6 sm:w-2/3" : "w-full"
    )}>
      <PageHeader title="Admin" description="Gérez la plateforme GENSHI" /> 
      <div className="grid gap-4">
        <RolesManagement />
      </div>
    </div>
  );
}

export default AdminPage;