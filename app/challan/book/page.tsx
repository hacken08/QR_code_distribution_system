"use client"

import { LogOut, Upload, Users, History, Activity } from "lucide-react"
import { formatHeaderTitle } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import type React from "react"
import { useState, useRef, useEffect } from "react"

export default function ChallanForm() {
  const [formData, setFormData] = useState({
    date: "",
    bookNo: "",
    srNo: "26",
    name: "",
    items: Array(20).fill({
      itemName: "",
      size: "",
      color: "",
      marka: "",
      poly: "",
      bag: "",
      box: "",
      pkg: "",
      nag: "",
      totalPcs: "",
      stdWt: "",
      nagWt: "",
      rate: "",
    }),
  })

  const [columnWidths, setColumnWidths] = useState({
    itemName: 180,
    itemCode: 70,
    color: 70,
    marka: 70,
    poly: 70,
    bag: 70,
    box: 70,
    stdPkg: 70,
    nag: 70,
    totalPcs: 70,
    stdWt: 70,
    actualWt: 70,
    rate: 70,
  })

  const [resizingColumn, setResizingColumn] = useState<string | null>(null)
  const [startX, setStartX] = useState(0)
  const tableContainerRef = useRef<HTMLDivElement>(null)

  const handleResizeStart = (e: React.MouseEvent, column: string) => {
    e.preventDefault()
    setResizingColumn(column)
    setStartX(e.clientX)
  }

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!resizingColumn) return
      const delta = e.clientX - startX
      setColumnWidths((p) => ({
        ...p,
        [resizingColumn]: Math.max(50, p[resizingColumn as keyof typeof p] + delta),
      }))
      setStartX(e.clientX)
    }

    const up = () => setResizingColumn(null)

    if (resizingColumn) {
      document.addEventListener("mousemove", move)
      document.addEventListener("mouseup", up)
      document.body.style.cursor = "col-resize"
      document.body.style.userSelect = "none"
      return () => {
        document.removeEventListener("mousemove", move)
        document.removeEventListener("mouseup", up)
        document.body.style.cursor = "auto"
        document.body.style.userSelect = "auto"
      }
    }
  }, [resizingColumn, startX])

  return (
    <>
      {/* 🌑 Ultra-Minimal Premium Scrollbar */}
      <style jsx>{`
        .challan-scroll {
          scrollbar-width:thin;
          scrollbar-color: rgba(0, 0, 0, 0.1) transparent;
        }

        .challan-scroll::-webkit-scrollbar {
          display: none
          width: 1px;
          height: 1 px;
        }

        .challan-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .challan-scroll::-webkit-scrollbar-thumb {
          background-color: rgba(0, 0, 0, 0.18);
          border-radius: 10px;
          transition: background-color 0.25s ease, opacity 0.25s ease;
          opacity: 0;
        }

        /* Appear only when user intends to scroll */
        .challan-scroll:hover::-webkit-scrollbar-thumb,
        .challan-scroll:active::-webkit-scrollbar-thumb {
          opacity: 0.3;
          background-color: rgba(0, 0, 0, 0.2);
        }

        .challan-scroll::-webkit-scrollbar-thumb:hover {
          background-color: rgba(0, 0, 0, 0.5);
        }

        .challan-scroll::-webkit-scrollbar-button {
          display: none;
        }
      `}</style>

      <div className="bg-white">
        <header className="border-b bg-card sticky top-0 z-50 mb-6">
          <div className="max-w-6xl mx-auto px-3 md:px-4 py-2 md:py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
            <div className="min-w-0">
              <h1 className="text-xl md:text-2xl font-bold text-foreground">QR Code Manager</h1>
              <p className="text-xs md:text-sm text-muted-foreground">Challan Entry</p>
            </div>
            <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4">
              <div className="text-right">
                <p className="text-xs md:text-sm font-medium truncate"></p>
                <p className="text-xs text-muted-foreground">Supervisor</p>
              </div>
              <Button variant="outline" size="sm" onClick={e=>{}} className="gap-2 bg-transparent text-xs md:text-sm">
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </div>
          </div>
        </header>

        
        <div className="w-[70%] mx-auto  border-2  border-black rounded-md p-5">

          {/* Header */}
          <div className="flex  justify-between mb-4  text-sm">
            <div className="space-y-2">
              <div>
                <b>Date :</b>
                <input className="border-b ml-2 outline-none" />
              </div>
              <div>
                <b>Name :</b>
                <input className="border-b ml-2 w-64 outline-none" />
              </div>
            </div>

            <div className="space-y-2 text-right">
              <div>
                <b>Book No :</b>
                <input className="border-b ml-2 w-20 outline-none" />
              </div>
              <div>
                <b>Sr No :</b>
                <input className="border-b ml-2 w-14 text-red-600 font-bold outline-none" />
              </div>
            </div>
          </div>

          {/* Table */}
          <div
            ref={tableContainerRef}
            className="challan-scroll overflow-x-auto border rounded-t-md border-black"
          >
            <table className="border-collapse w-max text-sm ">
              <thead className="sticky top-0 bg-gray-50">
                <tr>
                  {Object.keys(columnWidths).map((key) => (
                    <th
                      key={key}
                      style={{ width: columnWidths[key as keyof typeof columnWidths] }}
                      className="border border-black px-2 py-1 relative group font-semibold"
                    >
                      {formatHeaderTitle(key)}
                      <div
                        className="absolute right-0 top-0 h-full w-[1.9px] bg-black/30 opacity-0 group-hover:opacity-100 cursor-col-resize"
                        onMouseDown={(e) => handleResizeStart(e, key)}
                      />
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {formData.items.map((item, i) => (
                  <tr key={i} className="hover:bg-black/5 transition-colors">
                    {Object.keys(item).map((field) => (
                      <td
                        key={field}
                        style={{ width: columnWidths[field as keyof typeof columnWidths] }}
                        className="border border-black px-1"
                      >
                        <input className="w-full text-center bg-transparent outline-none" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="border border-t-0 rounded-b-md border-black text-center font-bold py-2">
            Grand Total
          </div>
        </div>
      </div>
    </>
  )
}
