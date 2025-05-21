"use client";

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { MainLayout } from '@/components/main-layout';

interface UserInfo {
  userName: string | null;
  userPicture: string | null;
}

export default function DocPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    // Check URL parameters first (after OAuth redirect)
    const token = searchParams.get('token');
    const userName = searchParams.get('userName');
    const userPicture = searchParams.get('userPicture');

    if (token && userName && userPicture) {
      // Store token and user info in localStorage
      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userPicture', userPicture);
      // Update state
      setUser({ userName, userPicture });
      // Clean up URL - redirect without query parameters
      // router.replace('/doc', undefined, { shallow: true }); // Requires useRouter, but simple replace might work
       window.history.replaceState({}, document.title, "/doc"); // Simple history manipulation

    } else {
      // If no URL params, check localStorage for existing login
      const storedToken = localStorage.getItem('authToken');
      const storedUserName = localStorage.getItem('userName');
      const storedUserPicture = localStorage.getItem('userPicture');

      if (storedToken && storedUserName && storedUserPicture) {
        setUser({ userName: storedUserName, userPicture: storedUserPicture });
      } else {
        // No stored login, user is not logged in
        setUser(null); // Explicitly set to null if not logged in
      }
    }
  }, [searchParams]); // Rerun effect when searchParams change

  // Pass user state to MainLayout
  return <MainLayout user={user} />;
} 