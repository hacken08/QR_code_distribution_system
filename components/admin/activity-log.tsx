"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface ActivityRecord {
  id: string
  timestamp: string
  operator: string
  action: string
  details: string
  type: "download" | "upload" | "request" | "approval"
}

const mockActivities: ActivityRecord[] = [
  {
    id: "1",
    timestamp: "2024-10-26 14:45",
    operator: "Operator 1",
    action: "Downloaded QR Codes",
    details: "MCB Box - 100 items",
    type: "download",
  },
  {
    id: "2",
    timestamp: "2024-10-26 14:30",
    operator: "Admin User",
    action: "Uploaded File",
    details: "products_batch_001.xlsx - 150 items",
    type: "upload",
  },
  {
    id: "3",
    timestamp: "2024-10-26 14:15",
    operator: "Operator 2",
    action: "Requested QR Codes",
    details: "Module Box - 50 items",
    type: "request",
  },
  {
    id: "4",
    timestamp: "2024-10-26 14:00",
    operator: "Admin User",
    action: "Approved Request",
    details: "Operator 2 - Module Box",
    type: "approval",
  },
  {
    id: "5",
    timestamp: "2024-10-26 13:45",
    operator: "Operator 3",
    action: "Downloaded QR Codes",
    details: "Fan Box - 75 items",
    type: "download",
  },
]

const getActivityColor = (type: string) => {
  switch (type) {
    case "download":
      return "bg-blue-100 text-blue-800"
    case "upload":
      return "bg-green-100 text-green-800"
    case "request":
      return "bg-yellow-100 text-yellow-800"
    case "approval":
      return "bg-purple-100 text-purple-800"
    default:
      return "bg-gray-100 text-gray-800"
  }
}

export function ActivityLog() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Activity Log</CardTitle>
        <CardDescription>Track all operator and system activities</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {mockActivities.map((activity) => (
            <div key={activity.id} className="flex items-start gap-4 pb-3 border-b last:border-0">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Badge className={getActivityColor(activity.type)}>
                    {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  </Badge>
                  <span className="font-medium text-sm">{activity.operator}</span>
                </div>
                <p className="text-sm font-medium">{activity.action}</p>
                <p className="text-xs text-muted-foreground mt-1">{activity.details}</p>
              </div>
              <span className="text-xs text-muted-foreground whitespace-nowrap">{activity.timestamp}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
