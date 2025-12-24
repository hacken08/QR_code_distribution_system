/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"
import { useRouter } from "next/navigation"
import { useState } from "react"
// import { Flex, Text, Button } from "@radix-ui/themes";
import { Button } from "@/components/ui/button"
// import { Input } from "@/components/ui/input"
import { QrCode } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"




export default function LoginPageRoute() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [selectedRole, setSelectedRole] = useState<"admin" | "operator" | null>(null)


  const handleLogin = () => {
    if (selectedRole) {
      if (selectedRole === "admin") {
        router.push("/admin")
      } else {
        router.push("/operator")
      }
    }
  }

  return <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <Card className="w-full max-w-md shadow-lg">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-3 rounded-lg">
            <QrCode className="w-8 h-8 text-white" />
          </div>
        </div>
        <CardTitle className="text-2xl">QR Code Manager</CardTitle>
        <CardDescription>Factory QR Code Management System</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Your Name</label>
          <Input
            placeholder="Enter your name"
            value={name}
            onChange={(e: any) => setName(e.target.value)}
            onKeyPress={(e: any) => e.key === "Enter" && handleLogin()}
          />
        </div>

        <div className="space-y-3">
          <label className="text-sm font-medium">Select Role</label>
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant={selectedRole === "admin" ? "default" : "outline"}
              onClick={() => setSelectedRole("admin")}
              className="h-24 flex flex-col items-center justify-center"
            >
              <div className="text-2xl mb-2">👨‍💼</div>
              <span>Admin</span>
            </Button>
            <Button
              variant={selectedRole === "operator" ? "default" : "outline"}
              onClick={() => setSelectedRole("operator")}
              className="h-24 flex flex-col items-center justify-center"
            >
              <div className="text-2xl mb-2">👷</div>
              <span>Operator</span>
            </Button>
          </div>
        </div>

        <Button
          onClick={handleLogin}
          disabled={!name.trim() || !selectedRole}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          Login
        </Button>
      </CardContent>
    </Card>
  </div>
}
