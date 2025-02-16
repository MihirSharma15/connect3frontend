"use server"

export async function searchUserByName(name: string): Promise<UserInDb[]> {
  const response = await fetch(`http://localhost:8000/api/${name}`, {
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
  