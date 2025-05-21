import { Suspense } from "react";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { MainLayout } from "@/components/main-layout";

interface UserInfo {
  userName: string | null;
  userPicture: string | null;
}

// 客户端组件，包含 useSearchParams、useEffect 逻辑
function DocPageInner() {
  "use client";
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
      window.history.replaceState({}, document.title, "/doc");
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
  }, [searchParams]);

  // Pass user state to MainLayout
  return (
    <>
      <MainLayout user={user} />
    </>
  );
}

// 服务器端导出，Suspense 包裹客户端组件
export default function Page() {
  return (
    <Suspense>
      <DocPageInner />
    </Suspense>
  );
}
