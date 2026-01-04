"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DownloadHistory } from "@/components/operator/download-history"
import { DownloadSection } from "@/components/operator/download-section"
import { RequestQRCode } from "@/components/operator/request-qr-code"
import { Button } from "@/components/ui/button"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { LogOut, Download, Plus, History } from "lucide-react"

export default function OperatorPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("downloads")


  useEffect(() => {
    // setUserName(storedUserName || "")
    // setIsLoading(false)
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }


  return (
    <div className="min-h-screen bg-background">
      {
        isLoading
          ? (
            <div className="min-h-screen bg-background flex items-center justify-center">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                <p className="text-foreground">Loading...</p>
              </div>
            </div>
          )
          : <>
            <header className="border-b bg-card sticky top-0  shadow z-50">
              <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
                <div className="min-w-0">
                  <h1 className="text-xl md:text-2xl font-bold text-foreground">QR Code Manager</h1>
                  <p className="text-xs md:text-sm text-muted-foreground">Operator Panel</p>
                </div>
                <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
                  <div className="text-right">
                    <p className="text-xs md:text-sm font-medium truncate">{userName}</p>
                    <p className="text-xs text-muted-foreground">Operator</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2 bg-transparent text-xs md:text-sm">
                    <LogOut className="w-4 h-4" />
                    <span className="hidden sm:inline">Logout</span>
                  </Button>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-3 md:px-4 py-4 md:py-8">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="flex w-full justify-between  mb-4 md:mb-8 gap-1 outline p-0.5 py-1 md:gap-0 bg-[#f5f5f5] rounded-md h-10">
                  <TabsTrigger value="downloads" className={`gap-1 md:gap-2  ${activeTab === "downloads" && `shadow-md bg-white`} text-xs md:text-sm flex items-center w-full justify-center mx-1  rounded-md`}>
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Downloads</span>
                  </TabsTrigger>
                  <TabsTrigger value="history" className={`gap-1 md:gap-2  ${activeTab === "history" && `shadow-md bg-white`} text-xs md:text-sm flex items-center w-full justify-center mx-1  rounded-md`}>
                    <History className="w-4 h-4" />
                    <span className="hidden sm:inline">History</span>
                  </TabsTrigger>
                  <TabsTrigger value="request" className={`gap-1 md:gap-2  ${activeTab === "request" && `shadow-md bg-white`} text-xs md:text-sm flex items-center w-full justify-center mx-1  rounded-md`}>
                    <Plus className="w-4 h-4" />
                    <span className="hidden sm:inline">Request</span>
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="downloads" className="space-y-4">
                  <DownloadSection />
                </TabsContent>

                <TabsContent value="history" className="space-y-4">
                  <DownloadHistory />
                </TabsContent>

                <TabsContent value="request" className="space-y-4">
                  <RequestQRCode />
                </TabsContent>
              </Tabs>
            </main>
          </>
      }
    </div >
  )
}
