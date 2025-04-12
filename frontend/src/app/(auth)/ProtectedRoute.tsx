"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken, removeAuthCookie } from "@/utils/authUtils";

export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = getAuthToken(document);
      if (!token) {
        router.push("/login");
        return;
      }

      /**
      // Verify token's validity with the backend
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/validate`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        removeAuthCookie();
        router.push("/login");
      } else {
        console.log("User is authenticated");
      }
    */

    };

    checkAuthentication();
  }, [router]);

  return <>{children}</>;
}
