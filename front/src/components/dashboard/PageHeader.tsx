import { useSidebar } from "@/components/ui/sidebar";

function PageHeader({ title, description }: { title: string, description: string }) {
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <div>
      <h2 className="text-3xl font-bold tracking-tight text-genshi-blue-secondary">{title}</h2>
      <p>
        {description}
      </p>
    </div>
  );
} 

export default PageHeader;