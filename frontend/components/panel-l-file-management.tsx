"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { OpenPanel } from "@/components/panels/panel-l-open"
import { LibraryPanel } from "@/components/panels/panel-l-library"
import { SourcePanel } from "@/components/panels/panel-l-source"

const TABS_LOCAL_KEY = "file-management-panel-tab"

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

// Sample paper sources with more items to demonstrate scrolling
const sampleSources = [
  {
    id: "src1",
    name: "arXiv",
    url: "https://arxiv.org",
    description: "Open access archive for scholarly articles",
    lastUpdated: "2025-05-12",
    status: "active",
  },
  {
    id: "src2",
    name: "ScienceDirect",
    url: "https://www.sciencedirect.com",
    description: "Scientific and medical research platform",
    lastUpdated: "2025-05-10",
    status: "active",
  },
  {
    id: "src3",
    name: "IEEE Xplore",
    url: "https://ieeexplore.ieee.org",
    description: "Research database for technology information",
    lastUpdated: "2025-05-08",
    status: "error",
  },
  {
    id: "src4",
    name: "SpringerLink",
    url: "https://link.springer.com",
    description: "Online collection of scientific documents",
    lastUpdated: "2025-05-05",
    status: "active",
  },
  {
    id: "src5",
    name: "PubMed",
    url: "https://pubmed.ncbi.nlm.nih.gov",
    description: "Biomedical literature database",
    lastUpdated: "2025-05-03",
    status: "active",
  },
  {
    id: "src6",
    name: "JSTOR",
    url: "https://www.jstor.org",
    description: "Digital library of academic journals and books",
    lastUpdated: "2025-05-01",
    status: "active",
  },
  {
    id: "src7",
    name: "Nature",
    url: "https://www.nature.com",
    description: "Scientific journal publishing research in all fields",
    lastUpdated: "2025-04-28",
    status: "active",
  },
  {
    id: "src8",
    name: "ACM Digital Library",
    url: "https://dl.acm.org",
    description: "Computing and information technology research",
    lastUpdated: "2025-04-25",
    status: "active",
  },
]

interface FileManagementPanelProps {
  onFileSelect: (filePath: string) => void
}

export function FileManagementPanel({ onFileSelect }: FileManagementPanelProps) {
  const [activeTab, setActiveTab] = useState(() => {
    if (typeof window !== "undefined") {
      return localStorage.getItem(TABS_LOCAL_KEY) || "open"
    }
    return "open"
  })
  
  const handleTabChange = (tab: string) => {
    setActiveTab(tab)
    if (typeof window !== "undefined") {
      localStorage.setItem(TABS_LOCAL_KEY, tab)
    }
  }


  return (

    <div className="flex flex-col h-full">
    <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 ">
      <TabsList className="grid grid-cols-3 mx-4 mt-2 mb-0">
        <TabsTrigger value="open" className="text-xs">Open</TabsTrigger>
        <TabsTrigger value="library" className="text-xs">Library</TabsTrigger>
        <TabsTrigger value="source" className="text-xs">Source</TabsTrigger>
      </TabsList>

      <TabsContent value="open" className="flex-1 flex flex-col mt-0 p-0">
        <OpenPanel onFileSelect={onFileSelect} />
      </TabsContent>
      <TabsContent value="library" className="flex-1 flex flex-col mt-0 p-0">
        <LibraryPanel onFileSelect={onFileSelect} />
      </TabsContent>
      <TabsContent value="source" className="flex-1 flex flex-col mt-0 p-0">
        <SourcePanel onFileSelect={onFileSelect} />
      </TabsContent>
    </Tabs>
  </div>
  )
}
