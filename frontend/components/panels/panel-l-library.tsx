"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { FileText, Search, Plus, Tag, SortDesc, Filter, FolderTree, ChevronRight, ChevronDown } from "lucide-react"
import { Badge } from "@/components/ui/badge"

// Sample library structure with more items to demonstrate scrolling
const sampleLibrary = [
  {
    id: "dir1",
    name: "AI Research",
    files: [
      {
        id: "f1",
        name: "Deep Learning Fundamentals.pdf",
        date: "2025-05-01",
        path: "/lib/ai/dl-fundamentals.pdf",
        tags: ["AI", "Tutorial"],
      },
      {
        id: "f2",
        name: "Transformer Architecture.pdf",
        date: "2025-04-20",
        path: "/lib/ai/transformer.pdf",
        tags: ["AI", "NLP"],
      },
      {
        id: "f3",
        name: "Reinforcement Learning.pdf",
        date: "2025-04-15",
        path: "/lib/ai/rl.pdf",
        tags: ["AI", "RL"],
      },
      {
        id: "f4",
        name: "Neural Networks Theory.pdf",
        date: "2025-04-10",
        path: "/lib/ai/nn-theory.pdf",
        tags: ["AI", "Theory"],
      },
    ],
    subdirectories: [
      {
        id: "dir1-1",
        name: "Computer Vision",
        files: [
          {
            id: "f5",
            name: "Object Detection Survey.pdf",
            date: "2025-03-15",
            path: "/lib/ai/cv/object-detection.pdf",
            tags: ["CV", "Survey"],
          },
          {
            id: "f6",
            name: "Image Segmentation.pdf",
            date: "2025-02-10",
            path: "/lib/ai/cv/segmentation.pdf",
            tags: ["CV"],
          },
          {
            id: "f7",
            name: "Face Recognition.pdf",
            date: "2025-02-05",
            path: "/lib/ai/cv/face-recognition.pdf",
            tags: ["CV", "Recognition"],
          },
        ],
        subdirectories: [],
      },
      {
        id: "dir1-2",
        name: "Natural Language Processing",
        files: [
          {
            id: "f8",
            name: "BERT Architecture.pdf",
            date: "2025-03-10",
            path: "/lib/ai/nlp/bert.pdf",
            tags: ["NLP", "Architecture"],
          },
          {
            id: "f9",
            name: "Sentiment Analysis.pdf",
            date: "2025-03-05",
            path: "/lib/ai/nlp/sentiment.pdf",
            tags: ["NLP", "Analysis"],
          },
        ],
        subdirectories: [],
      },
    ],
  },
  {
    id: "dir2",
    name: "Quantum Physics",
    files: [
      {
        id: "f10",
        name: "Quantum Entanglement.pdf",
        date: "2025-04-05",
        path: "/lib/quantum/entanglement.pdf",
        tags: ["Physics", "Quantum"],
      },
      {
        id: "f11",
        name: "Quantum Computing Basics.pdf",
        date: "2025-03-22",
        path: "/lib/quantum/computing.pdf",
        tags: ["Quantum", "Computing"],
      },
      {
        id: "f12",
        name: "Quantum Field Theory.pdf",
        date: "2025-03-15",
        path: "/lib/quantum/field-theory.pdf",
        tags: ["Quantum", "Theory"],
      },
    ],
    subdirectories: [],
  },
  {
    id: "dir3",
    name: "Biotechnology",
    files: [
      {
        id: "f13",
        name: "CRISPR Applications.pdf",
        date: "2025-04-02",
        path: "/lib/biotech/crispr.pdf",
        tags: ["Biotech", "CRISPR"],
      },
      {
        id: "f14",
        name: "Synthetic Biology.pdf",
        date: "2025-03-25",
        path: "/lib/biotech/synthetic.pdf",
        tags: ["Biotech", "Synthetic"],
      },
    ],
    subdirectories: [],
  },
  {
    id: "dir4",
    name: "Mathematics",
    files: [
      { id: "f15", name: "Number Theory.pdf", date: "2025-05-12", path: "/lib/math/number-theory.pdf", tags: ["Math"] },
      { id: "f16", name: "Calculus Advanced.pdf", date: "2025-05-11", path: "/lib/math/calculus.pdf", tags: ["Math"] },
      {
        id: "f17",
        name: "Linear Algebra.pdf",
        date: "2025-05-10",
        path: "/lib/math/linear-algebra.pdf",
        tags: ["Math"],
      },
    ],
    subdirectories: [],
  },
  {
    id: "dir5",
    name: "Computer Science",
    files: [
      { id: "f18", name: "Algorithms.pdf", date: "2025-05-09", path: "/lib/cs/algorithms.pdf", tags: ["CS"] },
      { id: "f19", name: "Data Structures.pdf", date: "2025-05-08", path: "/lib/cs/data-structures.pdf", tags: ["CS"] },
      { id: "f20", name: "Operating Systems.pdf", date: "2025-05-07", path: "/lib/cs/os.pdf", tags: ["CS"] },
    ],
    subdirectories: [],
  },
  {
    id: "dir6",
    name: "Physics",
    files: [
      { id: "f21", name: "Relativity.pdf", date: "2025-05-06", path: "/lib/physics/relativity.pdf", tags: ["Physics"] },
      { id: "f22", name: "Mechanics.pdf", date: "2025-05-05", path: "/lib/physics/mechanics.pdf", tags: ["Physics"] },
      { id: "f23", name: "Thermodynamics.pdf", date: "2025-05-04", path: "/lib/physics/thermo.pdf", tags: ["Physics"] },
    ],
    subdirectories: [],
  },
  {
    id: "default",
    name: "Default",
    files: [
      { id: "f24", name: "Unsorted Paper 1.pdf", date: "2025-05-12", path: "/lib/default/paper1.pdf", tags: [] },
      { id: "f25", name: "Unsorted Paper 2.pdf", date: "2025-05-11", path: "/lib/default/paper2.pdf", tags: [] },
      { id: "f26", name: "Unsorted Paper 3.pdf", date: "2025-05-10", path: "/lib/default/paper3.pdf", tags: [] },
    ],
    subdirectories: [],
  },
]

interface LibraryPanelProps {
  onFileSelect: (filePath: string) => void
}

export function LibraryPanel({ onFileSelect }: LibraryPanelProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(null)
  const [expandedDirs, setExpandedDirs] = useState<string[]>(["default", "dir1"]) // Expand some directories by default

  const handleFileClick = (file: { id: string; path: string }) => {
    setSelectedFile(file.id)
    onFileSelect(file.path)
  }

  const toggleDirExpand = (dirId: string) => {
    setExpandedDirs((prev) => (prev.includes(dirId) ? prev.filter((id) => id !== dirId) : [...prev, dirId]))
  }

  // Recursive function to render directory tree
  const renderDirectory = (dir: (typeof sampleLibrary)[0], level = 0) => {
    const isExpanded = expandedDirs.includes(dir.id)

    return (
      <div key={dir.id} className="mb-1">
        <div
          className="flex items-center gap-1 py-1 px-1 hover:bg-accent hover:text-accent-foreground rounded-md cursor-pointer"
          onClick={() => toggleDirExpand(dir.id)}
        >
          <div className="w-4 h-4 flex items-center justify-center">
            {isExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </div>
          <FolderTree size={16} className={level === 0 ? "text-primary" : "text-muted-foreground"} />
          <span className={`text-sm ${level === 0 ? "font-medium" : ""}`}>{dir.name}</span>
          <Badge variant="outline" className="ml-auto text-xs">
            {dir.files.length}
          </Badge>
        </div>

        {isExpanded && (
          <div className="ml-5 pl-2 border-l border-border">
            {dir.files.map((file) => (
              <div
                key={file.id}
                className={`flex items-center gap-2 py-1 px-1 rounded-md cursor-pointer hover:bg-accent hover:text-accent-foreground ${
                  selectedFile === file.id ? "bg-accent text-accent-foreground" : ""
                }`}
                onClick={() => handleFileClick(file)}
              >
                <FileText size={14} className="flex-shrink-0" />
                <span className="text-sm truncate">{file.name}</span>
              </div>
            ))}

            {dir.subdirectories.map((subdir) => renderDirectory(subdir, level + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="flex flex-col flex-1 min-h-0">
      <div className="px-4 pt-0 pb-2 border-b shrink-0">
        {/* 顶部搜索栏，紧贴Tabs */}
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input placeholder="Search library..." className="pl-9" />
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="h-8 gap-1"><Plus size={14} />New Folder</Button>
          <Button variant="outline" size="sm" className="h-8 gap-1"><Tag size={14} />Tags</Button>
          <Button variant="outline" size="sm" className="h-8 gap-1"><SortDesc size={14} />Sort</Button>
          <Button variant="outline" size="sm" className="h-8 gap-1"><Filter size={14} />Filter</Button>
        </div>
      </div>
      <ScrollArea className="flex-1 min-h-0">
        {/* 关键：无 pt-2，无 p-4，无 py-4，且flex纵向布局保证内容贴顶 */}
        <div className="flex flex-col items-start min-h-full w-full">
          {sampleLibrary.map((dir) => renderDirectory(dir))}
        </div>
      </ScrollArea>
    </div>


  )
}
