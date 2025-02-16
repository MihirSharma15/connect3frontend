"use client";

import React, { useEffect, useState } from "react";
import Graph from "./components/graph";
import { searchUserByName } from "@/apis/auth"; // Import the API function

export default function Dashboard() {
  // Search input state
  const [search, setSearch] = useState(""); // User's search query
  const [results, setResults] = useState([]); // Search results
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null); // Debounce timer

  // Example graph data
  const nodes = [
    { id: 1, name: "Alice" },
    { id: 2, name: "Bob" },
    { id: 3, name: "Charlie" },
    { id: 4, name: "David" },
  ];

  const edges = [
    { source: 1, target: 2 },
    { source: 2, target: 3 },
    { source: 3, target: 4 },
  ];

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
    </div>
  );
}
