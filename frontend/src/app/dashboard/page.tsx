"use client";

import React, { useEffect, useState } from "react";
import Graph from "./components/graph";
import { searchUserByName, getCurrentUser, fetchUserGraph } from "@/apis/auth"; // Import the API function
import { getAuthToken } from "@/utils/authUtils";
import ProtectedRoute from "@/app/(auth)/ProtectedRoute";
import ShareDialog from "./components/ShareDialog";

localStorage.theme = 'light';

export default function Dashboard() {
  // Search input state
  const [search, setSearch] = useState(""); // User's search query
  const [results, setResults] = useState([]); // Search results
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null); // Debounce timer
  const [user, setUser]  = useState<object>({}); // User's search query
  const [nodes, setNodes]  = useState<{ name: string, id: string }[]>([]); // User's search query
  const [edges, setEdges]  = useState<{ source: string, target: string }[]>([]); // User's search query

  const userToken : string | undefined = getAuthToken();
  // Fetch the current user when the component mounts

  useEffect(() => {
    if (!userToken) return;

    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser(userToken);
        setUser(user);

        try {
          let { nodes, edges } = await fetchUserGraph(user.remaining_connections > 0 ? 1 : 4, userToken);
          if (user.remaining_connections > 0) {
            //Add blank nodes with ? in them
            for (let i = 0; i < user.remaining_connections; i++) {
              nodes.push({ name: "?", user_id: `blank${i}` });
              edges.push({ source: `blank${i}`, target: user.user_id });
            }
          }
          setNodes(nodes.map(n => ({ name: n.name, id: n.user_id, degree: n.user_id === user.user_id ? 0 : n.degree })));
          setEdges(edges);
        } catch (error) {
          console.error("Error fetching graph:", error);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [userToken]);

  // Fetch users by name
  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setResults([]); // Clear results for empty input
      return;
    }

    try {
      setIsLoading(true); // Set loading state
      const data = await searchUserByName(query);
      setResults(data); // Save the search results
    } catch (error) {
      console.error(error.message);
      setResults([]); // Clear results if there's an error
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  // Debounced search input handler
  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(event.target.value);

    // Clear the previous debounce timer
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // Set a new debounce timer
    const timer = setTimeout(() => {
      fetchUsers(event.target.value);
    }, 300); // Wait 300ms before making the API call
    setDebounceTimer(timer);
  };

  // Handle a user selection from the search results
  const handleSelectUser = (user: any) => {
    setSearch(user.name); // Set the selected user name in the input field
    setResults([]); // Clear the dropdown after selection
  };

  return (
    <ProtectedRoute>
    <div className="relative w-screen h-screen">
      {/* Search Bar */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-4/5 sm:w-96">
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search user by name..."
          className="w-full p-2 bg-white border border-black text-black rounded-md focus:outline-none"
        />

        {/* Dropdown for search results */}
        {isLoading && <div className="mt-2 text-sm text-gray-500">Loading...</div>}
        {!isLoading && results.length > 0 && (
          <div className="mt-2 bg-white border border-gray-300 rounded shadow">
            {results.map((user: any) => (
              <div
                key={user.id}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectUser(user)}
              >
                <p>{user.name}</p>
                <p className="text-sm text-gray-500">{user.phonenumber}</p>
              </div>
            ))}
          </div>
        )}
        {!isLoading && search.trim() && results.length === 0 && (
          <div className="mt-2 text-sm text-red-500">No users found.</div>
        )}
      </div>

      {/* Graph Component */}
      <Graph nodes={nodes} edges={edges} />

      {user.remaining_connections > 0 && (<ShareDialog num_connections={3-user.remaining_connections} invite_code={user.invite_code}/>)}
    </div>
    </ProtectedRoute>
  );
}
