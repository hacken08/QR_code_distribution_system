"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut, Upload, Users, History, Activity } from "lucide-react"
import { ActivityLog } from "@/components/admin/activity-log"
import { OperatorRequests } from "@/components/admin/operator-requests"
import { UploadHistory } from "@/components/admin/upload-history"
import { UploadSection } from "@/components/admin/upload-section"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"

export default function AdminPage() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("upload")

  useEffect(() => {
    
  }, [])

  const handleLogout = () => {
    router.push("/login")
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-foreground">Loading...</p>
        </div>
      </div>
    )
  }


  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-3 md:px-4 py-3 md:py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <div className="min-w-0">
            <h1 className="text-xl md:text-2xl font-bold text-foreground">QR Code Manager</h1>
            <p className="text-xs md:text-sm text-muted-foreground">Admin Panel</p>
          </div>
          <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
            <div className="text-right">
              <p className="text-xs md:text-sm font-medium truncate">{userName}</p>
              <p className="text-xs text-muted-foreground">Administrator</p>
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex w-full justify-between  mb-4 md:mb-8 gap-1 outline p-0.5 py-1 md:gap-0 bg-[#f5f5f5] rounded-md h-10">
            <TabsTrigger value="upload" className={`"gap-1 md:gap-2 flex text-xs md:text-sm  items-center ${activeTab === "upload" && `shadow-md bg-white`} w-full justify-center mx-1  rounded-md`}>
              <Upload className="w-4 h-4" />
              <span className="hidden sm:inline">Upload</span>
            </TabsTrigger>
            <TabsTrigger value="history" className={`gap-1 md:gap-2  ${activeTab === "history" && `shadow-md bg-white`} text-xs md:text-sm flex items-center w-full justify-center mx-1  rounded-md`}>
              <History className="w-4 h-4" />
              <span className="hidden sm:inline">History</span>
            </TabsTrigger>
            <TabsTrigger value="requests" className={`gap-1 md:gap-2  ${activeTab === "requests" && `shadow-md bg-white`} text-xs md:text-sm flex items-center w-full justify-center mx-1  rounded-md`}>
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">Requests</span>
            </TabsTrigger>
            <TabsTrigger value="activity" className={`gap-1 md:gap-2  ${activeTab === "activity" && `shadow-md bg-white`} text-xs md:text-sm flex items-center w-full justify-center mx-1  rounded-md`}>
              <Activity className="w-4 h-4" />
              <span className="hidden sm:inline">Activity</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-4">
            <UploadSection />
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <UploadHistory />
          </TabsContent>

          <TabsContent value="requests" className="space-y-4">
            <OperatorRequests />
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <ActivityLog />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
