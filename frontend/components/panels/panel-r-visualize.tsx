import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Network, Loader2 } from "lucide-react"

interface PanelRVisualizeProps {
  pdfPath: string | null
  loading: boolean
}

export function PanelRVisualize({ pdfPath, loading }: PanelRVisualizeProps) {
  return (
    <ScrollArea className="flex-1">
      {!pdfPath ? (
        <div className="p-6 text-center">
          <Network className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Select a document to visualize its structure</p>
        </div>
      ) : loading ? (
        <div className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Generating visualization...</p>
        </div>
      ) : (
        <div className="p-4">
          {/* 这里放置可视化内容，如知识图谱、结构树等 */}
          <div className="text-center text-muted-foreground">[Visualization Placeholder]</div>
        </div>
      )}
    </ScrollArea>
  )
} 