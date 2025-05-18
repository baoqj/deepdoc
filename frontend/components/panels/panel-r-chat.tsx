import React from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Loader2 } from "lucide-react"

interface ChatMessage {
  role: "user" | "assistant"
  content: string
}

interface PanelRChatProps {
  pdfPath: string | null
  loading: boolean
  question: string
  setQuestion: (q: string) => void
  chatMessages: ChatMessage[]
  handleQuestionSubmit: (e: React.FormEvent) => void
}

export function PanelRChat({ pdfPath, loading, question, setQuestion, chatMessages, handleQuestionSubmit }: PanelRChatProps) {
  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1">
        <div className="p-4 space-y-4">
          {!pdfPath ? (
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <p>Select a document to start chatting</p>
            </div>
          ) : chatMessages.length === 0 ? (
            <div className="text-center text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4" />
              <p>Ask a question about the document</p>
            </div>
          ) : (
            chatMessages.map((msg, idx) => (
              <div key={idx} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`rounded-lg px-3 py-2 max-w-[70%] text-sm ${msg.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                  {msg.content}
                </div>
              </div>
            ))
          )}
          {loading && (
            <div className="flex justify-center">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleQuestionSubmit} className="flex items-center gap-2 p-4 border-t">
        <Input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={e => setQuestion(e.target.value)}
          disabled={!pdfPath || loading}
        />
        <Button type="submit" disabled={!pdfPath || loading || !question.trim()}>
          <Send size={16} />
        </Button>
      </form>
    </div>
  )
} 