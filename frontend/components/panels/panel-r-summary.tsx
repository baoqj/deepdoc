import React from "react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Card, CardContent } from "@/components/ui/card"
import { FileText, Users, BookOpen, ListTree, Loader2 } from "lucide-react"

interface PanelRSummaryProps {
  pdfPath: string | null
  loading: boolean
}

export function PanelRSummary({ pdfPath, loading }: PanelRSummaryProps) {
  return (
    <ScrollArea className="flex-1">
      {!pdfPath ? (
        <div className="p-6 text-center">
          <FileText className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Select a document to view its summary</p>
        </div>
      ) : loading ? (
        <div className="p-6 text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Analyzing document...</p>
        </div>
      ) : (
        <div className="p-4 space-y-4">
          {/* Title Analysis */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <FileText size={18} className="mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Document Title</h3>
                  <p className="text-sm">Advanced Techniques in Quantum Computing: A Comprehensive Review</p>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <h4 className="font-medium text-muted-foreground mb-1">Related Papers:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Quantum Computing: Current State and Future Prospects (2024)</li>
                  <li>Quantum Algorithms for Machine Learning Applications (2023)</li>
                  <li>Error Correction in Quantum Systems (2025)</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          {/* Authors */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <Users size={18} className="mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Authors</h3>
                  <p className="text-sm">John Smith, Maria Chen, Robert Johnson</p>
                </div>
              </div>
              <div className="mt-3 text-sm">
                <h4 className="font-medium text-muted-foreground mb-1">Author Information:</h4>
                <p className="mb-2"><strong>John Smith</strong>: Professor of Quantum Physics at MIT, with over 50 publications in the field of quantum computing.</p>
                <p className="mb-2"><strong>Maria Chen</strong>: Research Scientist at IBM Quantum, specializing in quantum algorithms.</p>
                <p><strong>Robert Johnson</strong>: PhD candidate at Stanford University, focusing on quantum error correction.</p>
              </div>
            </CardContent>
          </Card>
          {/* Abstract */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <BookOpen size={18} className="mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Abstract</h3>
                </div>
              </div>
              <div className="mt-2 text-sm">
                <p className="mb-3">This paper provides a comprehensive review of recent advances in quantum computing, focusing on algorithmic improvements, hardware developments, and potential applications in various fields including cryptography, optimization, and machine learning.</p>
                <h4 className="font-medium text-muted-foreground mb-1">Key Points:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Overview of quantum computing principles and current technological limitations</li>
                  <li>Analysis of recent breakthroughs in quantum error correction</li>
                  <li>Comparison of different quantum hardware platforms</li>
                  <li>Discussion of practical applications and timeline for quantum advantage</li>
                </ul>
              </div>
            </CardContent>
          </Card>
          {/* Section Summaries */}
          <Card>
            <CardContent className="p-4">
              <div className="flex items-start gap-2 mb-2">
                <ListTree size={18} className="mt-0.5 text-primary" />
                <div>
                  <h3 className="font-medium">Section Summaries</h3>
                </div>
              </div>
              {/* ...可继续补充... */}
            </CardContent>
          </Card>
        </div>
      )}
    </ScrollArea>
  )
} 