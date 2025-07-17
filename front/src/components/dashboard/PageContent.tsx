'use client';

import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

function PageContent({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div className={cn(
      "flex flex-col gap-4 p-4 pt-0 h-full"
    )}>
      <div className={cn(
        "w-full",
        isCollapsed && "flex justify-center"
      )}>
        {children}
      </div>
    </div>
  );
}

export default PageContent; 