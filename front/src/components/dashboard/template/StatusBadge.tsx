import { cn } from "@/lib/utils";

function StatusBadge({ status, style="text-xs" }: { status: number, style?: string }) 
{
  return (
    <span className={cn("inline-block shadow-sm text-white font-bold px-4 py-1 rounded-full", 
      style,
      status === 0 && "bg-genshi-blue-secondary/50",
      status === 1 && "bg-green",
      status === 2 && "bg-red",
      )}>
      {status === 0 ? "Brouillon" : 
       status === 1 ? "Actif" : 
       status === 2 ? "Désactivé" : "Inconnu"}
    </span>
  );
}

export default StatusBadge;