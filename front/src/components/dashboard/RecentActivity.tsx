import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const activities = [
  {
    type: "nft-created",
    title: "New NFT Created",
    description: "Equipment NFT #1234 was created",
    time: "2 min ago",
    color: "bg-green-500",
  },
  {
    type: "template-updated",
    title: "Template Updated",
    description: "Nuclear Reactor template was modified",
    time: "1 hour ago",
    color: "bg-blue-500",
  },
  {
    type: "user-connected",
    title: "User Connected",
    description: "New user joined the platform",
    time: "3 hours ago",
    color: "bg-yellow-500",
  },
];

function RecentActivity() {
  return (
    <Card className="col-span-4">
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
        <CardDescription>
          Latest NFT transactions and template updates
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity) => (
            <div key={activity.type} className="flex items-center space-x-4">
              <div className={`w-2 h-2 ${activity.color} rounded-full`}></div>
              <div className="flex-1">
                <p className="text-sm font-medium">{activity.title}</p>
                <p className="text-xs text-muted-foreground">{activity.description}</p>
              </div>
              <span className="text-xs text-muted-foreground">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}  

export default RecentActivity;