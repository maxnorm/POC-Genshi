'use client';

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";

function DashboardHeader() {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]:h-12">
      <div className="flex items-center gap-2 px-4">
        <SidebarTrigger />
        {isCollapsed ? (
          <>
            <div className="h-4 w-px bg-border" />
            <h1 className="text-lg font-semibold text-genshi-blue-secondary">Menu</h1>
          </>
        ) : (
          null
        )}
      </div>
    </header>
  );
}

export default DashboardHeader;