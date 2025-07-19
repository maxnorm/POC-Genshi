'use client'

import { cn } from "@/lib/utils";
import { useSidebar } from "@/components/ui/sidebar";

function PageWrapper({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={cn(
      "space-y-6",
      isCollapsed ? "w-5/6 sm:w-2/3" : "w-full"
    )}>
      {children}
    </div>
  )
}

export default PageWrapper;