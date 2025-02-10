"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function VerifyOTP() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const mockOTP = sessionStorage.getItem("mockOTP");

  function handleVerify() {
    if (otp === mockOTP) {
      router.push("/register");
    } else {
      setError("Invalid OTP. Please try again.");
    }
  }

  return (
    <div className="flex items-center justify-center h-screen bg-blue-500">
      <Card className="w-full max-w-md p-6 bg-white rounded-lg shadow-lg">
        <CardHeader>
          <CardTitle>Verify OTP</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              placeholder="Enter OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
            />
            {error && <p className="text-red-500">{error}</p>}
            <Button onClick={handleVerify} className="w-full">
              Verify
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
