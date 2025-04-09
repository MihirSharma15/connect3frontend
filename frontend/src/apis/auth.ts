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

// apis/auth.ts
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
    const errorBody = await response.text();
    console.error("Register user failed. Status:", response.status);
    console.error("Response body:", errorBody);

    let errorMessage = "Failed to create account. Please try again.";
    if (errorBody.includes("validation")) {
      errorMessage = "Validation error: Failed to create account.";
    } else if (errorBody.includes("phone number")) {
      errorMessage = "Phone number issue: Failed to create account.";
    }

    throw new Error(errorMessage);
  }

  return response.json();
}

export async function loginUser(data: { phonenumber: string; password: string }) {
  const formData = new URLSearchParams({
    username: data.phonenumber,
    password: data.password,
  });

  const response = await fetch(`${API_BASE_URL}/auth/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: formData.toString(),
  });

  if (!response.ok) {
    const errorBody = await response.json();
    console.error("Error response body:", errorBody);

    let errorMessage;
    if (errorBody.detail && Array.isArray(errorBody.detail)) {
      errorMessage = errorBody.detail.map((error: any) => error.msg).join(" | ");
    } else if (errorBody.detail) {
      errorMessage = errorBody.detail;
    } else if (errorBody.message) {
      errorMessage = errorBody.message;
    } else {
      errorMessage = "Login failed. Unknown error.";
      console.warn("Unknown error structure:", errorBody);
    }

    throw new Error(errorMessage);
  }

  return await response.json();
}

export async function registerAndLogin(
  data: { name: string; password: string; phonenumber: string },
  accessToken: string
) {
  const registerResponse = await registerUser(data, accessToken);
  
  const loginResponse = await fetch(`${API_BASE_URL}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      username: data.phonenumber,
      password: data.password,
    }),
  });

  if (!loginResponse.ok) {
    const errorBody = await loginResponse.json();
    console.error("Error response body:", errorBody);

    let errorMessage;
    if (errorBody.detail && Array.isArray(errorBody.detail)) {
      errorMessage = errorBody.detail.map((error: any) => error.msg).join(" | ");
    } else if (errorBody.detail) {
      errorMessage = errorBody.detail;
    } else if (errorBody.message) {
      errorMessage = errorBody.message;
    } else {
      errorMessage = "Login failed. Unknown error.";
      console.warn("Unknown error structure:", errorBody);
    }

    throw new Error(errorMessage);
  }

  const loginData = await loginResponse.json();
  return loginData.access_token; 
}


export async function connectWithFriend(receiverPhoneNumber: string, token: string) {
  const url = new URL(`${API_BASE_URL}/users/connect`);
  url.searchParams.append('receiver_number', receiverPhoneNumber); // Query parameter instead 

  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  const responseText = await response.text();

  try {
    const errorBody = JSON.parse(responseText);

    if (!response.ok) {
      if (errorBody.detail.includes("Not Found")) {
        throw new Error("User not found.");
      } else if (errorBody.detail.includes("already connected")) {
        throw new Error("Users are already connected.");
      } else {
        throw new Error(errorBody.detail || "Unexpected connection error.");
      }
    }

    return JSON.parse(responseText);
  } catch (error) {
    if (typeof responseText === "string") {
      console.error("Failed to parse JSON. Raw response:", responseText);
      throw new Error(`Unexpected API response: ${responseText}`);
    } else {
      console.error("Failed to parse JSON.");
      throw error;
    }
  }
}

export async function getCurrentUser(token: string): Promise<UserInDb[]> {
  return searchUserByName("me", token);
}

export async function searchUserByName(name: string, token: string): Promise<UserInDb[]> {
  const response = await fetch(`${API_BASE_URL}/users/${name}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error("User not found");
    }
    throw new Error("Failed to search user");
  }

  return response.json();
}

export async function fetchUserGraph(degrees: number = 6, token: string) {
  if (!token) {
    throw new Error("No access token provided.");
  }

  const response = await fetch(`${API_BASE_URL}/users/graph?degrees=${degrees}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error fetching graph: ${response.statusText} - ${errorBody}`);
  }

  return response.json(); // Expected format: { nodes: [...], edges: [...] }
}

export async function fetchShortestPathTo(user: string, token: string) {
  if (!token) {
    throw new Error("No access token provided.");
  }

  const response = await fetch(`${API_BASE_URL}/users/id/${user}/shortest-path`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Error fetching graph: ${response.statusText} - ${errorBody}`);
  }

  return response.json();
}


  