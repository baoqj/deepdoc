"use client"

import { useState, useRef, useEffect } from "react"
import { FileManagementPanel } from "@/components/panel-l-file-management"
import { PdfViewer } from "@/components/pdf-viewer"
import { AnalysisPanel } from "@/components/panel-r-analysis"
import { MainMenu } from "@/components/main-menu"
import { useMobile } from "@/hooks/use-mobile"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"
import { shouldHidePanel } from "@/utils/resize-utils"

export function MainLayout() {
  const [currentPdf, setCurrentPdf] = useState<string | null>(null)
  const [leftPanelOpen, setLeftPanelOpen] = useState(true)
  const [rightPanelOpen, setRightPanelOpen] = useState(true)
  const isMobile = useMobile()

  // Store the last valid width for each panel to restore when reopening
  const [leftPanelWidth, setLeftPanelWidth] = useState(280)
  const [rightPanelWidth, setRightPanelWidth] = useState(320)
  const [isResizingLeft, setIsResizingLeft] = useState(false)
  const [isResizingRight, setIsResizingRight] = useState(false)
  const leftResizeHandleRef = useRef<HTMLDivElement>(null)
  const rightResizeHandleRef = useRef<HTMLDivElement>(null)

  // Store the last valid width for restoration
  const lastValidLeftWidth = useRef(leftPanelWidth)
  const lastValidRightWidth = useRef(rightPanelWidth)

  // Update the stored width when panels are resized
  useEffect(() => {
    if (leftPanelWidth >= 300) {
      lastValidLeftWidth.current = leftPanelWidth
    }
  }, [leftPanelWidth])

  useEffect(() => {
    if (rightPanelWidth >= 300) {
      lastValidRightWidth.current = rightPanelWidth
    }
  }, [rightPanelWidth])

  const handleFileSelect = (filePath: string) => {
    setCurrentPdf(filePath)
    if (isMobile) {
      setLeftPanelOpen(false)
    }
  }

  // Toggle functions that restore the last valid width
  const toggleLeftPanel = () => {
    if (!leftPanelOpen) {
      // When opening, restore to the last valid width
      setLeftPanelWidth(lastValidLeftWidth.current)
    }
    setLeftPanelOpen(!leftPanelOpen)
  }

  const toggleRightPanel = () => {
    if (!rightPanelOpen) {
      // When opening, restore to the last valid width
      setRightPanelWidth(lastValidRightWidth.current)
    }
    setRightPanelOpen(!rightPanelOpen)
  }

  // Effect for handling left panel resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingLeft) {
        const newWidth = e.clientX
        setLeftPanelWidth(newWidth)

        // Auto-hide when width is less than threshold
        setLeftPanelOpen(!shouldHidePanel(newWidth))

        // Add a class to the body to prevent text selection during resize
        document.body.classList.add("resize-handle-active")
      }
    }

    const handleMouseUp = () => {
      setIsResizingLeft(false)
      document.body.classList.remove("resize-handle-active")
    }

    if (isResizingLeft) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.classList.remove("resize-handle-active")
    }
  }, [isResizingLeft])

  // Effect for handling right panel resize
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isResizingRight) {
        const newWidth = window.innerWidth - e.clientX
        setRightPanelWidth(newWidth)

        // Auto-hide when width is less than threshold
        setRightPanelOpen(!shouldHidePanel(newWidth))

        // Add a class to the body to prevent text selection during resize
        document.body.classList.add("resize-handle-active")
      }
    }

    const handleMouseUp = () => {
      setIsResizingRight(false)
      document.body.classList.remove("resize-handle-active")
    }

    if (isResizingRight) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      document.body.classList.remove("resize-handle-active")
    }
  }, [isResizingRight])

  return (
    <div className={`flex flex-col h-screen bg-background ${isResizingLeft || isResizingRight ? "resizing" : ""}`}>
      <MainMenu
        leftPanelOpen={leftPanelOpen}
        rightPanelOpen={rightPanelOpen}
        toggleLeftPanel={toggleLeftPanel}
        toggleRightPanel={toggleRightPanel}
      />

      <div className="flex flex-1 overflow-hidden">
        {/* Left Panel - File Management */}
        <div
          className={`${
            leftPanelOpen ? `w-[${leftPanelWidth}px]` : "w-0"
          } transition-all duration-300 bg-muted/30 overflow-hidden flex-shrink-0 border-r relative`}
          style={{ width: leftPanelOpen ? `${leftPanelWidth}px` : 0 }}
        >
          {leftPanelOpen && <FileManagementPanel onFileSelect={handleFileSelect} />}

          {/* Resize Handle */}
          {leftPanelOpen && (
            <div
              ref={leftResizeHandleRef}
              className="absolute right-0 top-0 w-1 h-full cursor-ew-resize hover:bg-primary/50 group"
              onMouseDown={() => setIsResizingLeft(true)}
            >
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-transparent group-hover:bg-primary/50"></div>
            </div>
          )}
        </div>

        {/* Mobile Toggle for Left Panel */}
        {isMobile && (
          <Button variant="ghost" size="icon" className="absolute top-16 left-2 z-50" onClick={toggleLeftPanel}>
            {leftPanelOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        )}

        {/* Middle Panel - PDF Viewer */}
        <div className="flex-1 overflow-hidden relative">
          <PdfViewer
            pdfPath={currentPdf}
            leftPanelOpen={leftPanelOpen}
            rightPanelOpen={rightPanelOpen}
            toggleLeftPanel={toggleLeftPanel}
            toggleRightPanel={toggleRightPanel}
          />
        </div>

        {/* Right Panel - Analysis */}
        <div
          className={`${
            rightPanelOpen ? `w-[${rightPanelWidth}px]` : "w-0"
          } transition-all duration-300 bg-muted/30 overflow-hidden flex-shrink-0 border-l relative`}
          style={{ width: rightPanelOpen ? `${rightPanelWidth}px` : 0 }}
        >
          {rightPanelOpen && <AnalysisPanel pdfPath={currentPdf} />}

          {/* Resize Handle */}
          {rightPanelOpen && (
            <div
              ref={rightResizeHandleRef}
              className="absolute left-0 top-0 w-1 h-full cursor-ew-resize hover:bg-primary/50 group"
              onMouseDown={() => setIsResizingRight(true)}
            >
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-transparent group-hover:bg-primary/50"></div>
            </div>
          )}
        </div>

        {/* Mobile Toggle for Right Panel */}
        {isMobile && (
          <Button variant="ghost" size="icon" className="absolute top-16 right-2 z-50" onClick={toggleRightPanel}>
            {rightPanelOpen ? <X size={20} /> : <Menu size={20} />}
          </Button>
        )}
      </div>
    </div>
  )
}
