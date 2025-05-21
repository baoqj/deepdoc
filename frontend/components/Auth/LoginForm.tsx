import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function LoginForm() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    // TODO: Replace with your backend API endpoint
    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      // Handle JWT or session here, then redirect
      console.log("Login successful", data);
      window.location.href = "/"; // Redirect to homepage
    } else {
      setError(data.detail || "Login failed. Please check your email or password.");
    }
  };

  return (
     <div className="max-w-md mx-auto mt-16 p-8 bg-white rounded-xl shadow-xl border border-gray-200 space-y-6">
      <h2 className="text-3xl font-bold text-center text-gray-800">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
         <div>
           <Label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Your email"
            value={form.email}
            onChange={handleChange}
            required
             className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <Label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="Enter password"
            value={form.password}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <Button type="submit" className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          Login
        </Button>
      </form>
       {error && <div className="mt-4 text-center text-red-600 text-sm">{error}</div>}

      <div className="text-center">
        <Link href="/signup" className="text-sm text-blue-600 hover:underline">
          No account? Sign up
        </Link>
      </div>

       <div className="text-center">
        <p className="text-sm text-gray-600 mb-3">Or login using a third-party account:</p>
         <div className="flex justify-center gap-4">
           {/* TODO: Replace with actual OAuth links from backend */}
            <a href="http://localhost:8000/auth/oauth/google" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              Google
            </a>
             <a href="http://localhost:8000/auth/oauth/github" className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
              GitHub
            </a>
         </div>
      </div>
    </div>
  );
} 