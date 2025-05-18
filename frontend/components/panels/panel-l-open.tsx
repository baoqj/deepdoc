"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Search, FolderOpen, Clock, SortAsc, SortDesc, Calendar, X, Upload, Link } from "lucide-react"

// Sample PDF files data
const samplePdfs = [
  { id: "1", name: "Research Paper on AI Ethics.pdf", date: "2025-05-10", path: "/sample1.pdf" },
  { id: "2", name: "Quantum Computing Advances.pdf", date: "2025-05-08", path: "/sample2.pdf" },
  { id: "3", name: "Climate Change Analysis 2025.pdf", date: "2025-05-05", path: "/sample3.pdf" },
  { id: "4", name: "Neural Networks in Medicine.pdf", date: "2025-05-01", path: "/sample4.pdf" },
  { id: "5", name: "Blockchain Technology Review.pdf", date: "2025-04-28", path: "/sample5.pdf" },
  { id: "6", name: "Space Exploration Roadmap.pdf", date: "2025-04-25", path: "/sample6.pdf" },
  { id: "7", name: "Renewable Energy Solutions.pdf", date: "2025-04-20", path: "/sample7.pdf" },
  { id: "8", name: "Machine Learning Algorithms.pdf", date: "2025-04-15", path: "/sample8.pdf" },
  { id: "9", name: "Artificial Intelligence in Healthcare.pdf", date: "2025-04-10", path: "/sample9.pdf" },
  { id: "10", name: "Robotics and Automation.pdf", date: "2025-04-05", path: "/sample10.pdf" },
  { id: "11", name: "Sustainable Energy Technologies.pdf", date: "2025-04-01", path: "/sample11.pdf" },
  { id: "12", name: "Nanotechnology Applications.pdf", date: "2025-03-28", path: "/sample12.pdf" },
  { id: "13", name: "Genetic Engineering Ethics.pdf", date: "2025-03-25", path: "/sample13.pdf" },
  { id: "14", name: "Cybersecurity Best Practices.pdf", date: "2025-03-20", path: "/sample14.pdf" },
  { id: "15", name: "Big Data Analytics.pdf", date: "2025-03-15", path: "/sample15.pdf" },
]

interface OpenPanelProps {
  onFileSelect: (filePath: string) => void
}

export function OpenPanel({ onFileSelect }: OpenPanelProps) {
  const [searchQuery, setSearchQuery] = useState("")
  const [urlInput, setUrlInput] = useState("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [dragActive, setDragActive] = useState(false)

  const filteredFiles = samplePdfs
    .filter((file) => file.name.toLowerCase().includes(searchQuery.toLowerCase()))
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.date.localeCompare(b.date)
      } else {
        return b.date.localeCompare(a.date)
      }
    })

  const handleFileClick = (file: { id: string; path: string }) => {
    setSelectedFile(file.id)
    onFileSelect(file.path)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      // Handle file drop
      console.log("Files dropped:", e.dataTransfer.files)
      // In a real implementation, you would process the files here
    }
  }

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Handle URL submission logic here
    console.log("URL submitted:", urlInput)
    // In a real implementation, you would fetch the paper from the URL
    setUrlInput("")
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pb-4 border-b">
        {/* URL Input Form */}
        <form onSubmit={handleUrlSubmit} className="flex items-center gap-2 mb-4">
          <div className="relative flex-1">
            <Link className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="url"
              placeholder="Enter paper URL..."
              className="pl-9"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
            />
          </div>
          <Button type="submit" size="sm">
            Import
          </Button>
        </form>

        {/* Drag and drop area */}
        <div
          className={`border-2 border-dashed rounded-lg p-3 text-center mb-4 ${
            dragActive ? "border-primary bg-primary/5" : "border-muted-foreground/20"
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <Upload className="h-6 w-6 mx-auto mb-1 text-muted-foreground" />
          <p className="text-sm font-medium">Drag & Drop PDF Files</p>
          <Button size="sm" variant="outline" className="mt-1">
            <Upload size={14} className="mr-1" /> Browse Files
          </Button>
        </div>

        <div className="flex items-center justify-between">
          <Button variant="outline" size="sm" className="gap-1">
            <FolderOpen size={14} />
            Open Folder
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
            title={sortOrder === "asc" ? "Oldest first" : "Newest first"}
          >
            {sortOrder === "asc" ? <SortAsc size={16} /> : <SortDesc size={16} />}
          </Button>
        </div>
      </div>

      <div className="flex flex-col flex-1 p-4 overflow-hidden">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
          <Clock size={14} />
          <span>Recent Files</span>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search files..."
            className="pl-9"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1 h-7 w-7"
              onClick={() => setSearchQuery("")}
            >
              <X size={14} />
            </Button>
          )}
        </div>

        {/* Added ScrollArea for Recent Files */}
        <ScrollArea className="flex-1">
          <div className="space-y-1 pr-3">
            {filteredFiles.map((file) => (
              <div
                key={file.id}
                className={`flex items-start gap-2 p-2 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                  selectedFile === file.id ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={() => handleFileClick(file)}
              >
                <FileText size={16} className="mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{file.name}</div>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Calendar size={12} className="mr-1" />
                    {new Date(file.date).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}

            {filteredFiles.length === 0 && <div className="py-8 text-center text-muted-foreground">No files found</div>}
          </div>
        </ScrollArea>
      </div>
    </div>
  )
}
