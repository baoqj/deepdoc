"use client";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import MainLayout from "@/components/main-layout";

interface UserInfo {
  userName: string | null;
  userPicture: string | null;
}

export default function DocPageInner() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const userName = searchParams.get('userName');
    const userPicture = searchParams.get('userPicture');

    if (token && userName && userPicture) {
      localStorage.setItem('authToken', token);
      localStorage.setItem('userName', userName);
      localStorage.setItem('userPicture', userPicture);
      setUser({ userName, userPicture });
      window.history.replaceState({}, document.title, "/doc");
    } else {
      const storedToken = localStorage.getItem('authToken');
      const storedUserName = localStorage.getItem('userName');
      const storedUserPicture = localStorage.getItem('userPicture');

      if (storedToken && storedUserName && storedUserPicture) {
        setUser({ userName: storedUserName, userPicture: storedUserPicture });
      } else {
        setUser(null);
      }
    }
  }, [searchParams]);

  return <MainLayout user={user} />;
}
