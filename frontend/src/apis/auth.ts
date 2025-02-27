"use server"

const API_BASE_URL = "https://api.connect3.live";

export async function sendOTP(phonenumber: string) {
  const response = await fetch(`${API_BASE_URL}/auth/send-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phonenumber }),
  });
  if (!response.ok) {
    const errorText = await response.text();
    console.error("Error response body:", errorText);
    throw new Error("Failed to send OTP. Please try again.");
   }
  return response.json();
}

export async function verifyCode(data: { phonenumber: string; code: string }) {
  const response = await fetch(`${API_BASE_URL}/auth/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to verify OTP.");
  }
  const result = await response.json();
  if (result.status !== "approved") {
    throw new Error("Wrong OTP. Please try again.");
  }
  return result;
}

export async function registerUser(
  data: { name: string; password: string; phonenumber: string },
  token: string
) {
  const response = await fetch(`${API_BASE_URL}/auth/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Phone-Verification-Token": token,
    },
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error("Failed to create account. Please try again.");
  }
  return response.json();
}

export async function connectWithFriend(receiverPhoneNumber: string, token: string) {
  const response = await fetch(`${API_BASE_URL}/users/connect`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ phonenumber: receiverPhoneNumber }),
  });
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.detail || "Failed to connect with the friend.");
  }
  return response.json();
}


export async function searchUserByName(name: string): Promise<UserInDb[]> {
  const response = await fetch(`${API_BASE_URL}/api/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("accessToken")}`, // Ensure the token exists
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to search user");
  }

  return response.json(); // Return user data from the API
}

export async function fetchUserGraph(degrees: number = 6) {
  // Retrieve the token from localStorage
  const token = localStorage.getItem("accessToken");
  if (!token) {
    throw new Error("No access token found in localStorage.");
  }

  const response = await fetch(`${API_BASE_URL}/users/graph?degrees=${degrees}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`, // Use token from localStorage
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error fetching graph: ${response.statusText} - ${errorBody}`);
  }

  return response.json(); // Expected format: { nodes: [...], edges: [...] }
}


  