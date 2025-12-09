/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import type React from "react"
import axios from 'axios'
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Upload, FileUp, AlertCircle, X } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Papa from "papaparse";
import { QrCodeSchemaList } from '../../app/database/schemas/qrcodeSchemas'
import {
  Input,
  notification
} from 'antd'
import { number } from "zod"

// import { addDoc, collection } from 'firebase/firestore'
// import { db } from '../../app/api/firebase-config'

export function UploadSection() {
  const [uploadType, setUploadType] = useState<"excel" | "qr">("excel")
  const [fileName, setFileName] = useState("")
  const [isUploading, setIsUploading] = useState(false)
  const [fileInput, setFileInput] = useState<HTMLInputElement | null>(null)
  const [qrCodeData, setQrCodeData] = useState<QrCodeSchemaList>([]);
  const [batchNo, setBatchNo] = useState<number>()
  const [itemCode, setItemCode] = useState<number>()
  const [api, contextHolder] = notification.useNotification()

  
  const handleFileSelect =  (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);      
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      complete: function (results: any) {
        const csvData: any[] = results.data;
        const qrCodes = csvData.map((data, idx) => {
          const dataValues = Object.values(data)
          try {
            return {
              itemCode: 1,
              batchNo: 1,
              productName: dataValues[1] as string,  
              qrcodeString: dataValues[4] as string,
              points: dataValues[3] as number
            }
          } catch (e: any) {
            console.info(`PARSING ERROR: Unable to parse data for row ${idx}\n ${data}`)
            return null
          }
        })
        let filterNullValue = qrCodes.filter(data => data !== null)
        filterNullValue = filterNullValue.filter(data => data.productName || data.qrcodeString)
        setQrCodeData(filterNullValue)
      },
    });
  };


  const handleUpload = async () => {
    if (!fileInput?.files?.[0]) return;
    const file = fileInput.files[0];

    // checking item code and batch no
    if (itemCode === undefined || batchNo === undefined) {
      api.error({
        title: 'Missing Field',
        description: 'Item code or batchNo is not provided.',
        duration: false,
      })
      return
    }
    
    setIsUploading(true);

    try {
      qrCodeData.forEach((qrData) => {
        qrData.batchNo = batchNo;
        qrData.itemCode = itemCode;
      })
      const res = await axios.post("/api/upload_qr", qrCodeData);
      if (res.status >= 400) throw new Error("Upload failed");
      alert("File uploaded successfully!");
    } catch (err) {
      console.error(err);
      alert("Error uploading file");
    } finally {
      setIsUploading(false);
    }
  };


  const clearFile = () => {
    // setFileName("");
    // if (fileInput) fileInput.value = "";
  };

  return (
    <div className="space-y-4 md:space-y-6">
      {contextHolder}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-lg md:text-2xl">Upload QR Codes</CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Upload product QR codes or Excel files to the system
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 md:space-y-6">
          <div className="grid grid-cols-2 gap-2 md:gap-4">
            <Button
              variant={uploadType === "excel" ? "default" : "outline"}
              onClick={() => setUploadType("excel")}
              className="h-16 md:h-20 flex flex-col items-center justify-center text-xs md:text-base"
            >
              <FileUp className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2" />
              <span>Excel File</span>
            </Button>
            <Button
              variant={uploadType === "qr" ? "default" : "outline"}
              onClick={() => setUploadType("qr")}
              className="h-16 md:h-20 flex flex-col items-center justify-center text-xs md:text-base"
            >
              <Upload className="w-5 h-5 md:w-6 md:h-6 mb-1 md:mb-2" />
              <span>QR Codes</span>
            </Button>
          </div>

          <div className="space-y-3">
            <label className="text-xs md:text-sm font-medium block">Select File</label>
            <div className="relative">
              <input
                ref={setFileInput}
                type="file"
                accept={uploadType === "excel" ? ".csv" : ".zip,.rar"}
                onChange={handleFileSelect}
                disabled={isUploading}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="flex items-center justify-center w-full px-4 py-6 md:py-8 border-2 border-dashed border-muted-foreground/25 rounded-lg hover:border-muted-foreground/50 hover:bg-muted/30 cursor-pointer transition-colors"
              >
                <div className="text-center">
                  <Upload className="w-6 h-6 md:w-8 md:h-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-xs md:text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {uploadType === "excel" ? "XLSX, XLS, CSV" : "ZIP, RAR"}
                  </p>
                </div>
              </label>
            </div>

            <div className="flex flex-col my-6 gap-2">
              <label className="text-xs md:text-sm font-medium block">Item Code</label>
              <Input placeholder="Item code" type={'number'} onChange={e=>setItemCode(parseInt(e.target.value))}/>
              <div className="h-3"></div>
              <label className="text-xs md:text-sm font-medium block">Batch No.</label>
              <Input placeholder="Batch No."  type={'number'} onChange={e=>setBatchNo(parseInt(e.target.value))} />
            </div>

            {fileName && (
              <div className="flex items-center justify-between p-3 md:p-4 bg-muted rounded-lg border">
                <div className="flex items-center gap-2 min-w-0">
                  <FileUp className="w-4 h-4 md:w-5 md:h-5  text-blue-600" />
                  <p className="text-xs md:text-sm font-medium truncate">{fileName}</p>
                </div>
                <button
                  onClick={clearFile}
                  className="p-1 hover:bg-background rounded transition-colors"
                  aria-label="Clear file"
                >
                  <X className="w-4 h-4 md:w-5 md:h-5" />
                </button>
              </div>
            )}
          </div>

          <div className="h-5"></div>
          
          {/* Info Alert */}
          <Alert className="text-xs md:text-sm">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <AlertDescription>
              {uploadType === "excel"
                ? "Excel file should contain columns: Product Name, QR Code, Quantity"
                : "Upload a ZIP file containing QR code images with product identifiers"}
            </AlertDescription>
          </Alert>

          <Button
            onClick={handleUpload}
            disabled={!fileName || isUploading}
            className="w-full bg-blue-600 cursor-pointer hover:bg-blue-700 gap-2 text-sm md:text-base py-2 md:py-3"
          >
            {isUploading ? "Uploading..." : "Upload File"}
          </Button>
        </CardContent>
      </Card>

      {/* Recent Uploads Preview */}
      <Card>
        <CardHeader className="pb-3 md:pb-6">
          <CardTitle className="text-base md:text-lg">Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-xs md:text-sm text-muted-foreground">
            <p>✓ products_batch_001.xlsx - 2 hours ago</p>
            <p>✓ qr_codes_module_box.zip - 5 hours ago</p>
            <p>✓ products_batch_002.xlsx - 1 day ago</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
