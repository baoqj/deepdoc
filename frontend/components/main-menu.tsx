"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { FileText, Settings, Upload, HelpCircle, ChevronDown, User, CreditCard, LogOut } from "lucide-react"

// Update the component to accept props for panel visibility control
export function MainMenu({
  leftPanelOpen,
  rightPanelOpen,
  toggleLeftPanel,
  toggleRightPanel,
}: {
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
}) {
  // For demonstration purposes - in a real app, this would come from auth state
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const handleLogin = () => {
    // In a real app, this would open a login modal or redirect to login page
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center px-4">
        <div className="flex items-center gap-2 font-semibold text-lg">
          <FileText className="h-6 w-6" />
          <span>DeepDoc</span>
        </div>

        <div className="flex items-center ml-4 gap-2">
          {/* File Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                File <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="gap-2">
                <FileText size={16} /> Open PDF
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">
                <Upload size={16} /> Import from URL
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="gap-2">
                <Settings size={16} /> Settings
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Edit Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Edit <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Copy</DropdownMenuItem>
              <DropdownMenuItem>Find in Document</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* View Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                View <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem onClick={() => toggleLeftPanel()}>
                {leftPanelOpen ? "Hide" : "Show"} Left Panel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => toggleRightPanel()}>
                {rightPanelOpen ? "Hide" : "Show"} Right Panel
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Zoom In</DropdownMenuItem>
              <DropdownMenuItem>Zoom Out</DropdownMenuItem>
              <DropdownMenuItem>Fit to Width</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Toggle Translation</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Tools Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Tools <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem>Reanalyze Document</DropdownMenuItem>
              <DropdownMenuItem>Export Analysis</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Help Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="gap-1">
                Help <ChevronDown size={14} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem className="gap-2">
                <HelpCircle size={16} /> Documentation
              </DropdownMenuItem>
              <DropdownMenuItem className="gap-2">About DeepDoc</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* User Authentication - Added to the far right */}
        <div className="ml-auto">
          {isLoggedIn ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full h-9 w-9">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center justify-start gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col space-y-0.5">
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">john.doe@example.com</p>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2">
                  <User size={16} /> Profile
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <Settings size={16} /> Settings
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <CreditCard size={16} /> Subscription Plan
                </DropdownMenuItem>
                <DropdownMenuItem className="gap-2">
                  <HelpCircle size={16} /> Help
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="gap-2" onClick={handleLogout}>
                  <LogOut size={16} /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleLogin}>
                Login
              </Button>
              <Button size="sm" onClick={handleLogin}>
                Register
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
