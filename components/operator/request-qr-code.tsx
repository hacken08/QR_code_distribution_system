"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { AlertCircle, Send } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface RequestRecord {
  id: string
  productName: string
  reason: string
  requestDate: string
  status: "pending" | "approved" | "rejected"
}

export function RequestQRCode() {
  const [productName, setProductName] = useState("")
  const [reason, setReason] = useState("")
  const [requests, setRequests] = useState<RequestRecord[]>([
    {
      id: "1",
      productName: "New Product XYZ",
      reason: "New product line added to production",
      requestDate: "2024-10-26 10:30",
      status: "pending",
    },
    {
      id: "2",
      productName: "Custom Box",
      reason: "Special order for client",
      requestDate: "2024-10-25 14:15",
      status: "approved",
    },
  ])
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitRequest = async () => {
    if (!productName.trim() || !reason.trim()) return

    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))

    const newRequest: RequestRecord = {
      id: String(requests.length + 1),
      productName,
      reason,
      requestDate: new Date().toLocaleString(),
      status: "pending",
    }

    setRequests([newRequest, ...requests])
    setProductName("")
    setReason("")
    setIsSubmitting(false)
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Request QR Codes</CardTitle>
          <CardDescription>Request QR codes for products not available in the database</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Product Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Name</label>
            <Input
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </div>

          {/* Reason */}
          <div className="space-y-2">
            <label className="text-sm font-medium">Reason for Request</label>
            <Textarea
              placeholder="Explain why you need QR codes for this product..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
          </div>

          {/* Info Alert */}
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Your request will be reviewed by the admin. You will be notified once it is approved or rejected.
            </AlertDescription>
          </Alert>

          {/* Submit Button */}
          <Button
            onClick={handleSubmitRequest}
            disabled={!productName.trim() || !reason.trim() || isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 gap-2"
          >
            <Send className="w-4 h-4" />
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </CardContent>
      </Card>

      {/* Request History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Your Requests</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {requests.map((request) => (
              <div key={request.id} className="border rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-medium">{request.productName}</h3>
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
                <p className="text-sm text-muted-foreground mb-2">{request.reason}</p>
                <p className="text-xs text-muted-foreground">Requested: {request.requestDate}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
