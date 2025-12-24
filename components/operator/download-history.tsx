"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Download, Eye, Info } from "lucide-react"

interface DownloadRecord {
  id: string
  productName: string
  quantity: number
  downloadDate: string
  fileName: string
  status: "completed" | "processing"
  availableAtTime: number
}

const mockHistory: DownloadRecord[] = [
  {
    id: "1",
    productName: "MCB Box",
    quantity: 100,
    downloadDate: "2024-10-26 14:45",
    fileName: "MCB_Box_100_20241026.xlsx",
    status: "completed",
    availableAtTime: 1350,
  },
  {
    id: "2",
    productName: "Module Box",
    quantity: 50,
    downloadDate: "2024-10-26 12:30",
    fileName: "Module_Box_50_20241026.xlsx",
    status: "completed",
    availableAtTime: 940,
  },
  {
    id: "3",
    productName: "Fan Box",
    quantity: 75,
    downloadDate: "2024-10-25 16:20",
    fileName: "Fan_Box_75_20241025.xlsx",
    status: "completed",
    availableAtTime: 725,
  },
]

export function DownloadHistory() {
  return (
    <Card>
      <CardHeader className="pb-3 md:pb-6">
        <CardTitle className="text-lg md:text-2xl">Download History</CardTitle>
        <CardDescription className="text-xs md:text-sm">View all your downloaded QR code files</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3 md:space-y-4">
          {mockHistory.map((record) => (
            <div
              key={record.id}
              className="border rounded-lg p-3 md:p-4 space-y-3 md:space-y-0 md:flex md:items-center md:justify-between"
            >
              <div className="flex-1 min-w-0">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                  <h3 className="font-medium text-sm md:text-base">{record.productName}</h3>
                  <Badge variant="outline" className="w-fit text-xs md:text-sm">
                    {record.quantity} items
                  </Badge>
                </div>
                <p className="text-xs md:text-sm text-muted-foreground truncate">{record.fileName}</p>
                <p className="text-xs text-muted-foreground mt-1">Downloaded: {record.downloadDate}</p>

                <div className="mt-2 p-2 md:p-3 bg-muted rounded-lg border border-muted-foreground/20">
                  <div className="flex items-center gap-1 text-xs md:text-sm">
                    <Info className="w-3 h-3 md:w-4 md:h-4 flex-shrink-0" />
                    <span className="text-muted-foreground">
                      <span className="font-medium">{record.availableAtTime.toLocaleString()}</span> QR codes available
                      at download time
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <Button variant="ghost" size="sm" className="gap-1 text-xs md:text-sm">
                  <Eye className="w-4 h-4" />
                  <span className="hidden sm:inline">View</span>
                </Button>
                <Button variant="ghost" size="sm" className="gap-1 text-xs md:text-sm">
                  <Download className="w-4 h-4" />
                  <span className="hidden sm:inline">Re-download</span>
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
