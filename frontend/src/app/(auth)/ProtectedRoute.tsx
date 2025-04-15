"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getAuthToken } from "@/utils/authUtils";

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
    };

    checkAuthentication();
  }, [router]);

  return <>{children}</>;
}
