"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authUtils";

export default function UnauthenticatedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = getAuthToken(document); 
      if (!token) {
        return;
      }

      /** 
      // Verify token with the backend for validity
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/validate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // If token is valid, redirect to /dashboard
        router.push("/dashboard");
      }
        */

      router.push("/dashboard"); // Remove after /validate is made
    };

    checkAuthentication();
  }, [router]);

  return <>{children}</>;
}
