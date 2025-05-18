"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import {
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Maximize,
  RotateCw,
  Download,
  Loader2,
  FileText,
  PanelLeft,
  PanelRight,
} from "lucide-react"

interface PdfViewerProps {
  pdfPath: string | null
  leftPanelOpen?: boolean
  rightPanelOpen?: boolean
  toggleLeftPanel?: () => void
  toggleRightPanel?: () => void
}

export function PdfViewer({
  pdfPath,
  leftPanelOpen = true,
  rightPanelOpen = true,
  toggleLeftPanel = () => {},
  toggleRightPanel = () => {},
}: PdfViewerProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(0)
  const [scale, setScale] = useState(1)
  const [loading, setLoading] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // This is a placeholder for PDF.js integration
  // In a real implementation, you would use PDF.js to render the PDF
  useEffect(() => {
    if (pdfPath) {
      setLoading(true)
      // Simulate loading a PDF
      setTimeout(() => {
        setTotalPages(10) // Example value
        setCurrentPage(1)
        setLoading(false)

        // In a real implementation, you would render the PDF page to the canvas
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext("2d")
          if (ctx) {
            // Clear canvas
            ctx.fillStyle = "#fff"
            ctx.fillRect(0, 0, canvas.width, canvas.height)

            // Draw placeholder content
            ctx.fillStyle = "#f0f0f0"
            ctx.fillRect(50, 50, canvas.width - 100, canvas.height - 100)

            ctx.font = "24px Arial"
            ctx.fillStyle = "#666"
            ctx.textAlign = "center"
            ctx.fillText("PDF Content Would Appear Here", canvas.width / 2, canvas.height / 2)

            ctx.font = "18px Arial"
            ctx.fillText(`Page ${currentPage} of ${totalPages}`, canvas.width / 2, canvas.height / 2 + 40)

            ctx.font = "14px Arial"
            ctx.fillText(`File: ${pdfPath}`, canvas.width / 2, canvas.height / 2 + 70)
          }
        }
      }, 1000)
    }
  }, [pdfPath, currentPage, scale])

  const goToPreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const goToNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.1, 2))
  }

  const zoomOut = () => {
    setScale((prev) => Math.max(prev - 0.1, 0.5))
  }

  const fitToWidth = () => {
    setScale(1) // In a real implementation, this would calculate the appropriate scale
  }

  return (
    <div className="flex flex-col h-full">
      {/* PDF Toolbar - Restructured with 3 sections */}
      <div className="flex items-center p-2 border-b bg-background/80 backdrop-blur-sm">
        {/* Left section */}
        <div className="flex items-center gap-1 w-1/3 justify-start">
          {/* Left Panel Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleLeftPanel}
            className="mr-1"
            title={leftPanelOpen ? "Hide left panel" : "Show left panel"}
          >
            <PanelLeft size={18} className={leftPanelOpen ? "text-primary" : "text-muted-foreground"} />
          </Button>


        </div>

        {/* Center section - Page numbers */}
        <div className="flex items-center justify-center w-1/3">
                  <Button variant="ghost" size="icon" onClick={goToPreviousPage} disabled={currentPage <= 1 || loading}>
            <ChevronLeft size={18} />
          </Button>
          <div className="flex items-center min-w-[100px] justify-center">
            <span className="text-sm">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : `${currentPage} / ${totalPages}`}
            </span>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={goToNextPage}
            disabled={currentPage >= totalPages || loading}
            className="ml-1"
          >
            <ChevronRight size={18} />
          </Button>
        </div>

        {/* Right section */}
        <div className="flex items-center gap-1 w-1/3 justify-end">
          <Button variant="ghost" size="icon" onClick={zoomOut} disabled={loading} title="Zoom Out">
            <ZoomOut size={18} />
          </Button>

          <span className="text-sm min-w-[40px] text-center">{Math.round(scale * 100)}%</span>

          <Button variant="ghost" size="icon" onClick={zoomIn} disabled={loading} title="Zoom In">
            <ZoomIn size={18} />
          </Button>

          <Button variant="ghost" size="icon" onClick={fitToWidth} disabled={loading} title="Fit to Width">
            <Maximize size={18} />
          </Button>

          <Button variant="ghost" size="icon" disabled={loading} title="Rotate">
            <RotateCw size={18} />
          </Button>

          <Button variant="ghost" size="icon" disabled={!pdfPath || loading} title="Download">
            <Download size={18} />
          </Button>

          {/* Right Panel Toggle Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRightPanel}
            className="ml-1"
            title={rightPanelOpen ? "Hide right panel" : "Show right panel"}
          >
            <PanelRight size={18} className={rightPanelOpen ? "text-primary" : "text-muted-foreground"} />
          </Button>
        </div>
      </div>

      {/* PDF Content Area */}
      <div className="flex-1 overflow-auto bg-gray-100 flex items-center justify-center p-4">
        {!pdfPath ? (
          <div className="text-center p-8 max-w-md">
            <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-medium mb-2">No PDF Selected</h3>
            <p className="text-muted-foreground mb-4">
              Select a PDF file from the file panel or import a paper from URL to get started.
            </p>
            <Button className="gap-2">
              <FileText size={16} /> Open PDF
            </Button>
          </div>
        ) : loading ? (
          <div className="flex flex-col items-center justify-center p-8">
            <Loader2 className="h-8 w-8 animate-spin mb-4" />
            <p className="text-muted-foreground">Loading PDF...</p>
          </div>
        ) : (
          <div className="shadow-lg transform" style={{ transform: `scale(${scale})` }}>
            <canvas ref={canvasRef} width={800} height={1100} className="bg-white" />
          </div>
        )}
      </div>
    </div>
  )
}
