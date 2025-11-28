"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
// import { toast } from 'sonner'
// import { addDoc, collection, Firestore } from "firebase/firestore"
// import { addinigFirst, db } from "@/app/api/firebase-config"
import { Select } from 'antd'
import axios from 'axios'

const productQRAvailability: Record<string, number> = {
  "MCB Box": 1250,
  "Module Box": 890,
  "Fan Box": 650,
  Concealed: 420,
  Ventogurd: 310,
  "Change Over": 580,
}

export function DownloadSection() {
  const [productName, setProductName] = useState("")
  const [quantity, setQuantity] = useState("")
  const [simulProduct, setSimulProduct] = useState("1")
  const [availableProduct, setAvailableProduct] = useState<{ productName: string }[]>([]);
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    const response = await fetch(`http://localhost:3000/api/auth/login`);
    console.log("Response of api req", response)
  }

  const isFormValid = productName.trim() && quantity && Number.parseInt(quantity) > 0
  const availableQR = productQRAvailability[productName] || 0
  const requestedQty = Number.parseInt(quantity) || 0
  const hasEnoughQR = requestedQty <= availableQR



  useEffect(() => {
    async function init() {
      try {
        const response = await axios.get("http://localhost:3000/api/get_product/");

        if (response.status < 300) {
          const productData = response.data.data;
          setAvailableProduct(productData);
        }
      } catch (err) {
        console.error(err);
      }
    }
    
    init()
  }, [])
  
  return (
    <div className="space-y-4 md:space-y-6">
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-2xl">Download QR Codes</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Generate and download QR code Excel file for your products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Product Name</label>
            <Select
              showSearch
              optionFilterProp="label"
              placeholder="Select a product"
              options={availableProduct.map((prod) => ({ label: prod.productName, value: prod.productName }))}
              onChange={(value) => setProductName(String(value))}
            />
            <p className="text-xs text-muted-foreground">
              Available products: MCB Box, Module Box, Fan Box, Concealed, Ventogurd, Change Over
            </p>
            {productName && (
              <div className="mt-2 p-2 md:p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs md:text-sm font-medium text-blue-900 dark:text-blue-100">
                  Available QR Codes: <span className="font-bold">{availableQR.toLocaleString()}</span>
                </p>
              </div>
            )}
          </div>

          {/* Quantity */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Quantity</label>
            <Input
              type="number"
              placeholder="Enter number of QR codes needed"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              className="text-xs md:text-sm"
            />
            {quantity && productName && (
              <div
                className={`mt-2 p-2 md:p-3 rounded-lg border ${hasEnoughQR
                    ? "bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800"
                  }`}
              >
                <p
                  className={`text-xs md:text-sm font-medium ${hasEnoughQR ? "text-green-900 dark:text-green-100" : "text-red-900 dark:text-red-100"
                    }`}
                >
                  {hasEnoughQR
                    ? `✓ ${(availableQR - requestedQty).toLocaleString()} QR codes will remain`
                    : `✗ Only ${availableQR.toLocaleString()} available (need ${requestedQty.toLocaleString()})`}
                </p>
              </div>
            )}
          </div>

          {/* Columns */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Simultaneous Product Limit</label>
            <Input
              type="number"
              placeholder="Simultaneous Product Limit"
              value={simulProduct}
              onChange={(e) => setSimulProduct(e.target.value)}
              min="1"
              max="10"
              className="text-xs md:text-sm"
            />
            <p className="text-xs text-muted-foreground">Enter the number of product you print at same time (1-10)</p>
          </div>

          {/* Info Alert */}
          <Alert className="text-xs md:text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <AlertDescription>
              The Excel file will contain unique QR codes for each product. Each code can be scanned to earn points.
            </AlertDescription>
          </Alert>

          {/* Download Button */}
          <Button
            onClick={handleDownload}
            // disabled={!isFormValid || isDownloading || !hasEnoughQR}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 gap-2 text-sm md:text-base py-2 md:py-3"
          >
            <Download className="w-4 h-4" />
            {isDownloading ? "Generating..." : "Download Excel File"}
          </Button>
        </CardContent>
      </Card>

      {/* Available Products */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-base md:text-lg">Available Products</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-3">
            {Object.entries(productQRAvailability).map(([product, count]) => (
              <div
                key={product}
                onClick={() => setProductName(product)}
                className="p-3 md:p-4 border rounded-lg text-xs md:text-sm font-medium text-center hover:bg-muted cursor-pointer transition-colors"
              >
                <p className="font-semibold">{product}</p>
                <p className="text-xs text-muted-foreground mt-1">{count.toLocaleString()} available</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
