"use client"

import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Search, Plus, RefreshCw, Globe, Settings, ChevronDown, X, AlertCircle, Download } from "lucide-react"

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

interface SourcePanelProps {
  onFileSelect: (filePath: string) => void
}

export function SourcePanel({ onFileSelect }: SourcePanelProps) {
  return (
    <div className="flex flex-col h-full ">
      <div className="px-4 pb-2 border-b">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Plus size={14} />
            Add
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <RefreshCw size={14} />
            Refresh
          </Button>
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search..." className="h-8 pl-9" />
          </div>
        </div>
      </div>

      {/* Added ScrollArea for Source list */}
      <ScrollArea className="flex-1 min-h-0">
        <div className="min-h-full">
          {sampleSources.map((source) => (
            <Collapsible key={source.id} className="border rounded-lg">
              <div className="p-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Globe size={16} className="text-primary" />
                  <div>
                    <div className="font-medium text-sm">{source.name}</div>
                    <div className="text-xs text-muted-foreground truncate max-w-[180px]">{source.url}</div>
                  </div>
                </div>

                <div className="flex items-center gap-1">
                  {source.status === "error" && (
                    <Badge variant="destructive" className="h-5 px-1 mr-1">
                      <AlertCircle size={12} className="mr-1" /> Error
                    </Badge>
                  )}
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-7 w-7">
                        <Settings size={14} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem className="gap-2">
                        <Settings size={14} /> Configure
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2">
                        <RefreshCw size={14} /> Update Now
                      </DropdownMenuItem>
                      <DropdownMenuItem className="gap-2 text-destructive">
                        <X size={14} /> Remove
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                  <CollapsibleTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-7 w-7">
                      <ChevronDown size={14} />
                    </Button>
                  </CollapsibleTrigger>
                </div>
              </div>

              <CollapsibleContent>
                <div className="px-3 pb-3 pt-1 border-t">
                  <p className="text-xs text-muted-foreground mb-2">{source.description}</p>
                  <div className="text-xs mb-2">Last updated: {new Date(source.lastUpdated).toLocaleDateString()}</div>

                  <div className="flex gap-2 mt-3">
                    <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
                      <Search size={12} /> Search
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-xs h-7">
                      <Download size={12} /> Download
                    </Button>
                    <Button size="sm" variant="outline" className="gap-1 text-xs h-7 ml-auto">
                      <RefreshCw size={12} /> Monitor
                    </Button>
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </div>
  )
}
