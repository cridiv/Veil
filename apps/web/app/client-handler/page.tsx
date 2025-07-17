"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ClientHandler() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthRedirect = () => {
      setTimeout(() => {
        router.push("/dashboard");
      }, 1000);
    };
    handleAuthRedirect();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[rgb(25, 26, 31)]">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#af1aff] mx-auto mb-4"></div>
        <p className="text-white text-lg">Checking authentication...</p>
      </div>
    </div>
  );
}
