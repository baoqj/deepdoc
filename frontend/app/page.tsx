"use client"

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Page() {
  const router = useRouter();

  const handleLoginClick = () => {
    router.push('/login');
  };

  const handleSignupClick = () => {
    router.push('/signup');
  };

  const handleStartClick = () => {
    router.push('/doc');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <div className="flex justify-end w-full p-4">
        <Button variant="outline" size="sm" onClick={handleLoginClick} className="mr-2">
          Login
        </Button>
        <Button size="sm" onClick={handleSignupClick}>
          Signup
        </Button>
      </div>
      <div className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-4xl font-bold text-primary">Welcome to DeepDoc</h1>
      <p className="mt-4 text-lg text-muted-foreground">Your AI-powered PDF reader and analysis tool.</p>
      <button
        className="mt-8 px-6 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
        onClick={handleStartClick}
      >
        Start
      </button>
    </div>
    </div>

  );
} 