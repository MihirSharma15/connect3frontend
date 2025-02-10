"use client";

import React, { useState } from "react";
import Graph from "./components/graph.tsx";

export default function Dashboard() {
  // Search input state
  const [search, setSearch] = useState("");

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

  // Search handler
  const handleSearch = (event) => {
    setSearch(event.target.value);
  };

  return (
    <div className="relative w-screen h-screen">
      {/* Search Bar */}
      <div
        className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10 w-4/5 sm:w-96"
      >
        <input
          type="text"
          value={search}
          onChange={handleSearch}
          placeholder="Search user by name..."
          className="w-full p-2 bg-white border border-black text-black rounded-md focus:outline-none"        />
      </div>

      {/* Graph Component */}
      <Graph nodes={nodes} edges={edges} />
    </div>
  );
}
