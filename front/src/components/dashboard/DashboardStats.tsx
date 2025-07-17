import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, FileText, Users, Shield } from "lucide-react";

const stats = [
  {
    title: "Total NFTs",
    value: "1,234",
    change: "+20.1% from last month",
    icon: Package,
  },
  {
    title: "Templates",
    value: "56",
    change: "+5 new this month",
    icon: FileText,
  },
  {
    title: "Active Users",
    value: "89",
    change: "+12% from last week",
    icon: Users,
  },
  {
    title: "Security Score",
    value: "98%",
    change: "Excellent security rating",
    icon: Shield,
  },
];

function DashboardStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat) => (
        <Card key={stat.title}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.change}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 

export default DashboardStats;