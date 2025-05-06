"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";

export function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [user, loading, router]);

  // Show nothing while loading or during redirect
  if (loading || !user) {
    return null;
  }

  // If authenticated, render children
  return children;
} 