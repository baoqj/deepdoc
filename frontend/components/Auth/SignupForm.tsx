import React, { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SignupForm() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    if (res.ok) {
      setSuccess("Sign up successful. Please log in.");
    } else {
      setError(data.detail || "Registration failed. Please check the information or try again.");
    }
  };

  return (
    <div className="max-w-md w-full mx-auto mt-14 mb-10 px-3">
      <div className="rounded-2xl bg-white shadow-2xl border border-gray-100 p-8 sm:p-10">
        <h2 className="text-3xl font-bold text-center mb-5 text-gray-900 tracking-tight">Sign Up for DeepDoc</h2>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <Label htmlFor="fullName" className="text-base">Full Name</Label>
            <Input
              id="fullName"
              name="fullName"
              type="text"
              placeholder="Your name"
              value={form.fullName}
              onChange={handleChange}
              required
              autoComplete="name"
            />
          </div>
          <div>
            <Label htmlFor="email" className="text-base">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="Your email"
              value={form.email}
              onChange={handleChange}
              required
              autoComplete="email"
            />
          </div>
          <div>
            <Label htmlFor="password" className="text-base">Password</Label>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="Set password"
              value={form.password}
              onChange={handleChange}
              required
              autoComplete="new-password"
            />
          </div>
          <Button type="submit" className="w-full text-base font-semibold py-2" variant="default">
            Sign Up
          </Button>
        </form>
        {error && <div className="mt-4 text-center text-red-600 text-sm">{error}</div>}
        {success && <div className="mt-4 text-center text-green-600 text-sm">{success}</div>}

        <div className="text-center mt-6">
          <Link href="/login" className="text-sm text-blue-700 hover:underline font-medium">
            Already have an account? Login
          </Link>
        </div>

        <div className="mt-8">
          <div className="flex items-center mb-5">
            <div className="flex-grow border-t border-gray-200" />
            <span className="mx-3 text-sm text-gray-400">or</span>
            <div className="flex-grow border-t border-gray-200" />
          </div>
          <div className="flex gap-4 justify-center">
            <a
              href="/api/auth/google"
              className="flex items-center gap-2 w-36 justify-center border border-gray-200 bg-white hover:bg-blue-50 rounded-lg px-3 py-2 shadow-sm font-medium transition"
            >
              <img src="/google.svg" alt="Google" className="h-5 w-5" />
              <span>Google</span>
            </a>
            <a
              href="/api/auth/github"
              className="flex items-center gap-2 w-36 justify-center border border-gray-200 bg-white hover:bg-gray-100 rounded-lg px-3 py-2 shadow-sm font-medium transition"
            >
              <img src="/github.svg" alt="GitHub" className="h-5 w-5" />
              <span>GitHub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
