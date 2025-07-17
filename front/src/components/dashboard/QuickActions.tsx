import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileText, Users } from "lucide-react";

const actions = [
  {
    title: "Create NFT",
    icon: Package,
    href: "/dashboard/nfts/create",
  },
  {
    title: "New Template",
    icon: FileText,
    href: "/dashboard/templates/create",
  },
  {
    title: "Invite User",
    icon: Users,
    href: "/dashboard/users/invite",
  },
];

function QuickActions() {
  return (
    <Card className="col-span-3">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks and shortcuts
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {actions.map((action) => (
            <button
              key={action.title}
              className="w-full text-left p-3 rounded-lg border hover:bg-accent transition-colors"
            >
              <div className="flex items-center space-x-2">
                <action.icon className="h-4 w-4" />
                <span className="text-sm font-medium">{action.title}</span>
              </div>
            </button>
          ))}
        </div>
      </CardContent>
    </Card>
  );
} 

export default QuickActions;