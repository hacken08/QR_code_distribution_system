/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Download, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {  SyncOutlined } from '@ant-design/icons';
import { Select, Button } from 'antd'
import { getProducts, getProductsQrCount, createExcelApi, downloadQrCodes } from "@/app/apiServices/apiService"
import { ProductType } from "@/app/database/schemas/productSchemas"
import { notification } from 'antd'

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
  const [divideQRcodeIn, setDivideQRcodeIn] = useState("1")
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [toastApi, contextHolder] = notification.useNotification()
  const [availableProduct, setAvailableProduct] = useState<ProductType[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<{productName: string, id: number, qrCodeCount: number }>()

  const handleDownload = async () => {
    setIsLoading(true)
    
    // Validation and check 
    if (!selectedProduct) {
      toastApi.warning({
        title: "Download Fail",
        description: "There is no product selected",
        duration: false
      })
      return
    }
    if (quantity === "" || !quantity ||  !divideQRcodeIn) {
      toastApi.warning({
        title: "Download Fail",
        description: "Enter quantity or 'Divide In'",
        duration: false
      })
      return
    } else if (!parseInt(quantity) || !parseInt(divideQRcodeIn)) {
      toastApi.warning({
        title: "Validation Error",
        description: "'Quantity' and 'Divide In' should be in numbers only",
        duration: false
      })
      return
    } 
    
    // Make a Api call to Server 
    const downloadApiResponse = await downloadQrCodes(
      selectedProduct.id, 
      parseInt(quantity)
    );

    // Checking api response
    if (!downloadApiResponse.status || !downloadApiResponse.data) {
      toastApi.error({
        title: "Download Fail",
        description: downloadApiResponse.error ?? "Something went wrong wrong while downloading QR Code",
        duration: false
      })
      return
    }
    const fileName = `${selectedProduct?.productName.replace(/[^a-zA-Z0-9]/g, ' ')} - ${downloadApiResponse.data[0].batch_no} - ${downloadApiResponse.data.length}`

    // Generting excel with QR code data
    console.log("{DEUBG INFO} DOwnloadApiresponse obj strucuter -> ", downloadApiResponse.data[0])
    const createExcelResponse = await createExcelApi(downloadApiResponse.data.map<any>((qrCode) => {
      return {
        qrcode_string: qrCode.qrcode_string,
        product_name: qrCode.product_name,
        product_id: qrCode.product_id,
        batch_no: qrCode.batch_no,
        points: qrCode.points,
        id: qrCode.id,
      }
    }), parseInt(divideQRcodeIn)) 
    const isExcelDownloadedByUser = await triggerSExcelDownload(createExcelResponse.data, fileName)
    if (!isExcelDownloadedByUser) {
      toastApi.error({
        title: "Download Fail", 
        description: "Something went wrong while downloading the excel. Check the console log for more information",
      })
    } else {
      toastApi.success({
        title: "Download Success", 
        description: `Your excel file "${fileName}" is downloaded`,
      })
    }
    setIsLoading(false)
  }

  const handleProductSelection = async (value: number) => {
    const product = availableProduct.find(prod => prod.id === value)
    if (!product) return
    const responseData = await getProductsQrCount(product.id)
    if (!responseData.status || !responseData.data) {
      toastApi.error({
        title: "Something went wrong",
        description: `Fail to know the count of QR Codes of '${product.product_name}'. Check console for more info `
      })
      console.error(responseData.error)
      return
    }
    setSelectedProduct({
      id: product.id,
      qrCodeCount: responseData.data,
      productName: product?.product_name ?? "",
    })
  }

  async function triggerSExcelDownload(blob: Blob, fileTitle: string): Promise<boolean> {
    try {
      const excelUrl = URL.createObjectURL(blob) 

      // creat a tag with trigger url
      const link = document.createElement('a') 
      link.href = excelUrl
      link.download = fileTitle

      // adding the created a tag into the DOM
      document.body.appendChild(link)
      link.click()

      // cleaning up the DOM after download is triggered
      document.body.removeChild(link)
      URL.revokeObjectURL(excelUrl)

      // Updating the available QR Code count
      handleProductSelection(selectedProduct?.id ?? 0)
      return true
    } catch (error: any) {
      console.error("{DOWNLOAD FAIL} error occured in downloadingExcel function: ", error)
      return false;
    }
  }
  
  useEffect(() => {
    async function init() {
      const response = await getProducts()
      if (!response.status || !response.data) {
        toastApi.error({
          title: "Something went wrong",
          description: `Fail to get the products'. Check console for more info `
        })
        console.error(response.error)
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
              showSearch={{
                optionFilterProp: 'label',
              }}
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
          </div>

          {/* Columns */}
          <div className="space-y-2">
            <label className="text-xs md:text-sm font-medium">Number of column QR code need to divide</label>
            <Input
              type="number"
              placeholder="QR Code to Divide in"
              value={divideQRcodeIn}
              onChange={(e) => setDivideQRcodeIn(e.target.value)}
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
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 gap-2 text-sm md:text-base py-2 md:py-3"
            loading={isLoading && { icon: <SyncOutlined spin /> }}
            type="primary"            
          >
            <Download className="w-4 h-4" />
            {"Download Excel File"}
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
