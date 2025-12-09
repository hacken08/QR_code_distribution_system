"use client"

import { useEffect, useState, useRef } from "react"
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
import { getProducts, getProductsQrCount } from "@/app/apiServices/apiService"
import { ProductType } from "@/app/database/schemas/productSchemas"
import { getDownloadQrCode } from '../../app/apiServices/apiService'
import { notification } from 'antd'
import { QrCodeType } from "@/app/database/schemas/qrcodeSchemas"

const productQRAvailability: Record<string, number> = {
  "MCB Box": 1250,
  "Module Box": 890,
  "Fan Box": 650,
  "Concealed": 420,
  "Ventogurd": 310,
  "Change Over": 580,
}

export function DownloadSection() {
  const [quantity, setQuantity] = useState("")
  const [simulProduct, setSimulProduct] = useState("1")
  const [availableProduct, setAvailableProduct] = useState<ProductType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{productName: string, id: number, qrCodeCount: number }>()
  const [isDownloading, setIsDownloading] = useState(false)
  const [toastApi, contextHolder] = notification.useNotification()
  const downloadedQrCode = useRef<QrCodeType[]>(undefined)


  const handleDownload = async () => {
    // Validation and check 
    if (quantity === "" || !quantity ) {
      console.log("{DOWNLOAD FAIL} Enter quantity to download")
      toastApi.warning({
        title: "DOWNLOAD FAIL",
        description: "Enter quantity to download",
        duration: false
      })
      return
    } else if (!parseInt(quantity)) {
      console.log("{VALIDATION FAIL} Quantity should be in numbers only")
      toastApi.warning({
        title: "Validation Error",
        description: "Quantity should be in numbers only",
        duration: false
      })
      return
    } else if (!selectedProduct) {
      console.log("{DOWNLOAD FAIL} There is no product selected")
      toastApi.warning({
        title: "Download Fail",
        description: "There is no product selected",
        duration: false
      })
      return
    }
    
    // ------- Make a Api call to Server --------
    const downloadApiResponse = await getDownloadQrCode(
      selectedProduct.id, 
      parseInt(quantity)
    );

    if (!downloadApiResponse.status || !downloadApiResponse.data) {
      toastApi.error({
        title: "Download Fail",
        description: downloadApiResponse.error ?? "Something went wrong wrong while downloading QR Code",
        duration: false
      })
      return
    }

    console.log("{INFO} Downloaded QR Code -> \n", downloadApiResponse)
    downloadedQrCode.current = downloadApiResponse.data
  }

  // const isFormValid = selectedProduct.trim() && quantity && Number.parseInt(quantity) > 0
  // const availableQR = productQRAvailability[selectedProduct] || 0
  // const requestedQty = Number.parseInt(quantity) || 0
  // const hasEnoughQR = requestedQty <= availableQR

  const handleProductSelection = async (value: number) => {
    const product = availableProduct.find(prod => prod.id === value)
    if (!product) return
    const responseData = await getProductsQrCount(product.id)
    console.log("{API FUNC RES} getProductQrCount  -> ", responseData )
    if (!responseData.status || !responseData.data) return
    setSelectedProduct({
      productName: product?.product_name ?? "", 
      qrCodeCount: responseData.data.count,
      id: product.id
    })
  }

  useEffect(() => {
    
  }, [])
  
  useEffect(() => {
    async function init() {
      const response = await getProducts()
      if (!response.status || !response.data) {
        return
      }
      setAvailableProduct(response.data)
    }
    init()
  }, [])
  
  return (
    <div className="space-y-4 md:space-y-6">
      {contextHolder}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-2xl">Download QR Codes</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Generate and download QR code Excel file for your products
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          {/* Debug: Remove after fixing */}
          {/* <div style={{ padding: '10px', background: '#f0f0f0', margin: '10px 0' }}>
            <pre>availableProduct: {JSON.stringify(availableProduct, null, 2)}</pre>
          </div> */}
          <div className="space-y-2 flex flex-col">
            <label className="text-xs md:text-sm font-medium">Product Name</label>
            <Select
              showSearch
              placeholder="Select a product"
              options={availableProduct.map((prod) => ({ label: prod.product_name, value: prod.id }))}
              onChange={handleProductSelection}
            />
            <p className="text-xs text-muted-foreground">
              Available products: MCB Box, Module Box, Fan Box, Concealed, Ventogurd, Change Over
            </p>
            {selectedProduct && (
              <div className="mt-2 p-2 md:p-3 bg-blue-50 dark:bg-blue-950 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-xs md:text-sm font-medium text-blue-900 dark:text-blue-100">
                  Available QR Codes: <span className="font-bold">{selectedProduct.qrCodeCount}</span>
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
            {/* {quantity && selectedProduct && (
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
            )} */}
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
                // onClick={() => setSelectedProduct(product)}
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
