"use client"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { FileText, Github, Twitter, Globe } from "lucide-react"

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            About DeepDoc
          </DialogTitle>
          <DialogDescription>AI-powered document analysis for researchers and knowledge workers</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="flex flex-col items-center justify-center gap-2 py-4">
            <div className="flex items-center justify-center h-16 w-16 rounded-full bg-primary/10">
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <h3 className="text-xl font-semibold">DeepDoc</h3>
            <p className="text-sm text-muted-foreground">Version 1.0.0</p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">About</h4>
            <p className="text-sm text-muted-foreground">
              DeepDoc is an advanced PDF reader with AI-powered analysis tools. It helps researchers and students
              understand complex documents, extract key insights, and connect information across multiple sources.
            </p>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Features</h4>
            <ul className="text-sm text-muted-foreground list-disc pl-5 space-y-1">
              <li>AI-powered document analysis and summarization</li>
              <li>Interactive chat with your documents</li>
              <li>Knowledge graph visualization</li>
              <li>Smart library management</li>
              <li>Research paper integration</li>
            </ul>
          </div>

          <div className="space-y-2">
            <h4 className="text-sm font-medium">Credits</h4>
            <p className="text-sm text-muted-foreground">
              Created by the DeepDoc Team. Built with Next.js, React, and Tailwind CSS.
            </p>
          </div>
        </div>
        <DialogFooter className="flex flex-col sm:flex-row gap-2">
          <div className="flex gap-2 sm:mr-auto">
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Github className="h-4 w-4" />
                <span className="sr-only">GitHub</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                <Twitter className="h-4 w-4" />
                <span className="sr-only">Twitter</span>
              </a>
            </Button>
            <Button variant="outline" size="icon" className="h-8 w-8" asChild>
              <a href="https://deepdoc.ai" target="_blank" rel="noopener noreferrer">
                <Globe className="h-4 w-4" />
                <span className="sr-only">Website</span>
              </a>
            </Button>
          </div>
          <Button onClick={() => onOpenChange(false)}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
