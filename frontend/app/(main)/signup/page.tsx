"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Eye, EyeOff, Github, Mail, X } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function SignupPage() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [passwordMatchStatus, setPasswordMatchStatus] = useState<'idle' | 'matching' | 'not-matching'>('idle')
  const [passwordMatchMessage, setPasswordMatchMessage] = useState('')
  const router = useRouter()

  // Effect to validate password match whenever password or confirmPassword changes
  useEffect(() => {
    if (password === '' && confirmPassword === '') {
      setPasswordMatchStatus('idle');
      setPasswordMatchMessage('');
    } else if (password === confirmPassword) {
      setPasswordMatchStatus('matching');
      setPasswordMatchMessage('Passwords match.');
    } else {
      setPasswordMatchStatus('not-matching');
      setPasswordMatchMessage('Passwords do not match.');
    }
  }, [password, confirmPassword]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (passwordMatchStatus !== 'matching') {
      toast.error("Please ensure passwords match.")
      return
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password }),
      })

      if (!response.ok) {
        try {
          const errorData = await response.json();
          if (response.status === 400 && errorData.detail === "Email already registered") {
            toast.error("Email already registered. Please use a different email.")
          } else if (errorData.detail) {
            toast.error(`Registration failed: ${errorData.detail}`)
          } else {
            toast.error(`Registration failed with status: ${response.status}`)
          }
        } catch (jsonError) {
          console.error("Failed to parse error response as JSON:", jsonError);
          toast.error(`Registration failed: Received unexpected response from server (Status: ${response.status}).`)
        }
        return
      }

      toast.success("Registration successful! Redirecting to login...")
      router.push("/login")

    } catch (error) {
      console.error("Registration request error:", error)
      toast.error("An error occurred while trying to connect to the server. Please check if the backend is running.")
    }
  }

  const handleClose = () => {
    const previousPath = window.history.state?.as;
    if (previousPath === '/') {
      router.push('/');
    } else {
      router.push('/doc');
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword)
  }

  const toggleShowConfirmPassword = () => {
    setShowConfirmPassword(!showConfirmPassword)
  }

  const isSubmitDisabled = passwordMatchStatus !== 'matching' || !name || !email || !password || !confirmPassword;


  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-end">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 rounded-full"
              onClick={handleClose}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <CardTitle className="text-2xl font-bold text-center">Create an account</CardTitle>
          <CardDescription className="text-center">Enter your information to create an account</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <Button variant="outline">
                <Github className="mr-2 h-4 w-4" />
                Github
              </Button>
              <Button variant="outline">
                <Mail className="mr-2 h-4 w-4" />
                Google
              </Button>
            </div>
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-gray-500">Or continue with</span>
              </div>
            </div>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2 relative">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                 <button
                  type="button"
                  onClick={toggleShowPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 z-10 mt-5"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
               <div className="space-y-2 relative">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
                 <button
                  type="button"
                  onClick={toggleShowConfirmPassword}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 z-10 mt-5"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-500" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-500" />
                  )}
                </button>
              </div>
              {passwordMatchMessage && (password || confirmPassword) &&(
                <p className={
                  passwordMatchStatus === 'not-matching'
                    ? 'text-red-500 text-sm mt-1'
                    : 'text-green-500 text-sm mt-1'
                }>
                  {passwordMatchMessage}
                </p>
              )}
              <Button type="submit" className="w-full" disabled={isSubmitDisabled}>
                Create account
              </Button>
            </form>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <div className="text-sm text-gray-500">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-600 hover:text-blue-500">
              Login
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
