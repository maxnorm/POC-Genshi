import { SidebarInset, useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import DashboardHeader from "./DashboardHeader";
import PageContent from "./PageContent";


function DashboardInset({ children }: { children: React.ReactNode }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <SidebarInset className={cn(
      isCollapsed && "w-screen"
    )}>
      <DashboardHeader />
      <PageContent>
        {children}
      </PageContent>
    </SidebarInset>
  );
}

export default DashboardInset;