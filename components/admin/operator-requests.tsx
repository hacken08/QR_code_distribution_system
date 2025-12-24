"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle, Clock } from "lucide-react"

interface RequestRecord {
  id: string
  operatorName: string
  productName: string
  quantity: number
  requestDate: string
  status: "pending" | "approved" | "rejected"
  reason?: string
}

const mockRequests: RequestRecord[] = [
  {
    id: "1",
    operatorName: "Operator 1",
    productName: "MCB Box",
    quantity: 100,
    requestDate: "2024-10-26 09:30",
    status: "pending",
  },
  {
    id: "2",
    operatorName: "Operator 2",
    productName: "Module Box",
    quantity: 50,
    requestDate: "2024-10-26 08:15",
    status: "approved",
  },
  {
    id: "3",
    operatorName: "Operator 3",
    productName: "Fan Box",
    quantity: 200,
    requestDate: "2024-10-25 15:45",
    status: "rejected",
    reason: "Product not in database",
  },
]

export function OperatorRequests() {
  const [requests, setRequests] = useState(mockRequests)

  const handleApprove = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "approved" } : r)))
  }

  const handleReject = (id: string) => {
    setRequests(requests.map((r) => (r.id === id ? { ...r, status: "rejected" } : r)))
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4 text-yellow-600" />
      case "approved":
        return <CheckCircle className="w-4 h-4 text-green-600" />
      case "rejected":
        return <XCircle className="w-4 h-4 text-red-600" />
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Operator Requests</CardTitle>
        <CardDescription>Manage QR code requests from operators</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {requests.map((request) => (
            <div key={request.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    {getStatusIcon(request.status)}
                    <h3 className="font-medium">{request.operatorName}</h3>
                    <Badge variant="outline">{request.productName}</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Quantity: {request.quantity} | Requested: {request.requestDate}
                  </p>
                </div>
                <Badge
                  className={
                    request.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : request.status === "approved"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                  }
                >
                  {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Badge>
              </div>

              {request.status === "pending" && (
                <div className="flex gap-2 pt-2">
                  <Button
                    size="sm"
                    onClick={() => handleApprove(request.id)}
                    className="bg-green-600 hover:bg-green-700"
                  >
                    Approve
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleReject(request.id)}>
                    Reject
                  </Button>
                </div>
              )}

              {request.reason && <p className="text-sm text-muted-foreground italic">Reason: {request.reason}</p>}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
