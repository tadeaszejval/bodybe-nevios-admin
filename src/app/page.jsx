"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthProvider";
import { LoadingScreen } from "../components/LoadingScreen";

export default function Page() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading) {
            if (user) {
                // Redirect authenticated users to dashboard
                router.push("/dashboard/home");
            } else {
                // Redirect unauthenticated users to login
                router.push("/login");
            }
        }
    }, [user, loading, router]);

    // Show loading screen while checking auth status
    return <LoadingScreen />;
}
