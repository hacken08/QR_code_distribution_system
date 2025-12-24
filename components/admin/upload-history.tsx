"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye } from "lucide-react"

interface UploadRecord {
  id: string
  fileName: string
  uploadDate: string
  uploadedBy: string
  fileType: "excel" | "qr"
  itemCount: number
  status: "completed" | "processing"
}

const mockHistory: UploadRecord[] = [
  {
    id: "1",
    fileName: "products_batch_001.xlsx",
    uploadDate: "2024-10-26 14:30",
    uploadedBy: "Admin User",
    fileType: "excel",
    itemCount: 150,
    status: "completed",
  },
  {
    id: "2",
    fileName: "qr_codes_module_box.zip",
    uploadDate: "2024-10-26 10:15",
    uploadedBy: "Admin User",
    fileType: "qr",
    itemCount: 200,
    status: "completed",
  },
  {
    id: "3",
    fileName: "products_batch_002.xlsx",
    uploadDate: "2024-10-25 16:45",
    uploadedBy: "Admin User",
    fileType: "excel",
    itemCount: 300,
    status: "completed",
  },
]

export function UploadHistory() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload History</CardTitle>
        <CardDescription>View all uploaded QR code files and their details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-4 font-medium">File Name</th>
                <th className="text-left py-3 px-4 font-medium">Type</th>
                <th className="text-left py-3 px-4 font-medium">Items</th>
                <th className="text-left py-3 px-4 font-medium">Upload Date</th>
                <th className="text-left py-3 px-4 font-medium">Status</th>
                <th className="text-left py-3 px-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {mockHistory.map((record) => (
                <tr key={record.id} className="border-b hover:bg-muted/50">
                  <td className="py-3 px-4">{record.fileName}</td>
                  <td className="py-3 px-4">
                    <Badge variant="outline">{record.fileType === "excel" ? "Excel" : "QR Codes"}</Badge>
                  </td>
                  <td className="py-3 px-4">{record.itemCount}</td>
                  <td className="py-3 px-4 text-muted-foreground">{record.uploadDate}</td>
                  <td className="py-3 px-4">
                    <Badge className="bg-green-100 text-green-800">Completed</Badge>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Eye className="w-4 h-4" />
                        View
                      </Button>
                      <Button variant="ghost" size="sm" className="gap-1">
                        <Download className="w-4 h-4" />
                        Download
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  )
}
