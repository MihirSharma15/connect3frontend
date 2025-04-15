"use client";

import React, { useEffect, useState } from "react";
import Graph from "./components/graph";
import { fetchShortestPathTo, getCurrentUser, fetchUserGraph } from "@/apis/auth"; // Import the API function
import { getAuthToken } from "@/utils/authUtils";
import ProtectedRoute from "@/app/(auth)/ProtectedRoute";
import ShareDialog from "./components/ShareDialog";
import { stringSimilarity } from "string-similarity-js";
import { Spinner } from "@/components/ui/spinner";
import StatusSheet from "./components/StatusSheet";
import StatusUpdate from "@/types/StatusUpdate";
import { getReadCookie } from "@/utils/readUtils";
import { get } from "http";

export default function Dashboard() {
  const [search, setSearch] = useState(""); // User's search query
  const [highlightEdges, setHighlightEdges] = useState([]); // Highlighted edges based on query
  const [results, setResults] = useState<string[]>([]); // Search results
  const [isLoading, setIsLoading] = useState(false); // Loading state
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null); // Debounce timer
  const [user, setUser]  = useState<object>({}); // Current user
  const [nodes, setNodes]  = useState<{ name: string, id: string }[]>([]); // Nodes in the graph
  const [edges, setEdges]  = useState<{ source: string, target: string }[]>([]); // Edges in the graph
  const [userToken, setUserToken] = useState<string | undefined>(undefined); // Auth token
  const [statusUpdates, setStatusUpdates] = useState<StatusUpdate[]>([]);
  const [userStatus, setUserStatus] = useState<StatusUpdate | undefined>();

const [unreadState, setUnreadState] = useState(false);

  const lastReadAt = React.useRef("");

  // Set userToken after component mounts on the client
  useEffect(() => {
    if (typeof document !== "undefined") {
      const token = getAuthToken(document);
      lastReadAt.current = getReadCookie(document) || "";
      setUserToken(token);
    }
  }, []);

  useEffect(() => {
    if (!userToken) return;

    const fetchCurrentUser = async () => {
      try {
        const user = await getCurrentUser(userToken);
        setUser(user);

        try {
          let { nodes, edges } = await fetchUserGraph(user.remaining_connections > 0 ? 3 : 7, userToken);
          if (user.remaining_connections > 0) {
            //Add blank nodes with ? in them
            for (let i = 0; i < user.remaining_connections; i++) {
              nodes.push({ name: "?", user_id: `blank${i}`, status: { } });
              edges.push({ source: `blank${i}`, target: user.user_id });
            }
          }
          setNodes(nodes.map(n => ({ name: n.name, id: n.user_id, degree: n.user_id === user.user_id ? 0 : n.degree })));
          setEdges(edges);

          let foundUserStatus : StatusUpdate | undefined = undefined;
          
          const statusUpdates = nodes.filter(node => node.status?.status_content).map(node => {
            console.log("checking", node)
            const status = {
              user_id: node.user_id,
              name: node.name,
              degree: node.status.status_degree,
              status: node.status.status_content,
              status_created_at: new Date(node.status.status_created_at),
              status_expires_at: new Date(new Date(node.status.status_created_at).getTime() + 1000 * 60 * 60 * 24)
            };
            if (!unreadState && status.status_created_at?.getTime() > parseInt(lastReadAt.current || "0")) setUnreadState(true);
            if (node.user_id === user.user_id && node.status.status_content) foundUserStatus = status;
            return status;
          });
          
          setStatusUpdates(statusUpdates);
          if (!foundUserStatus) foundUserStatus = {
            user_id: user.user_id,
            name: user.name,
            degree: 5,
            status: "",
            status_created_at: new Date(),
            status_expires_at: new Date()
          };
          if (!(userStatus?.status === "" && foundUserStatus.status === "")) setUserStatus(foundUserStatus);
        } catch (error) {
          console.error("Error fetching graph:", error);
        }
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, [userToken, unreadState]);

  // Fetch users for search
  const fetchUsers = async (query: string) => {
    if (!query.trim()) {
      setResults([]); // Clear results for empty input
      return;
    } // test

    const data = nodes.find(node => node.name.toLowerCase() === query.toLowerCase());

    if (!data) {
      const similarNodeSearch = user.remaining_connections > 0 ? nodes.filter(node => node.degree <= 2) : nodes;
      const similar = similarNodeSearch.sort((a, b) => stringSimilarity(query, b.name) - stringSimilarity(query, a.name)).slice(0, 3).map(node => node.name);
      setResults(similar);
      return;
    }

    if (data.id === user.user_id) {
      setResults([]); // Clear results if the user is searching for themselves
      setHighlightEdges([]); // Clear highlighted edges
      return;
    }

    try {
      setIsLoading(true); // Set loading state
      const shortestPath = await fetchShortestPathTo(data.id, userToken);
      setHighlightEdges(shortestPath); // Save the search results
    } catch (error) {
      setHighlightEdges([]); // Clear results if there's an error
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  useEffect(() => {
    if (search.trim()) {
      fetchUsers(search);
    } else {
      setResults([]); // Clear results for empty input
    }
  }, [search, nodes]); // Re-fetch when search or nodes change

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
  const handleSelectUser = (user: string) => {
    setSearch(user); // Set the selected user name in the input field
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
            {results.map((user: string) => (
              <div
                key={user}
                className="p-2 hover:bg-gray-100 cursor-pointer"
                onClick={() => handleSelectUser(user)}
              >
                <p>{user}</p>
              </div>
            ))}
          </div>
        )}
        {!isLoading && search?.trim() && highlightEdges.length === 0 && search?.trim() !== user.name && (
          <div className="mt-2 text-sm text-red-500">No users found.</div>
        )}
      </div>

      {/* Graph Component */}
      {!edges.length ? (<div className="flex items-center justify-center h-screen">
          <Spinner>Loading your social network.</Spinner>
        </div>) : (<Graph nodes={nodes} edges={edges} setQuery={setSearch} highlightEdges={highlightEdges} obscure={user.remaining_connections > 0} />) }
        {console.log(statusUpdates)}
      {user.remaining_connections > 0 && (<ShareDialog num_connections={3-user.remaining_connections} invite_code={user.invite_code}/>)}
      {user.remaining_connections === 0 && edges.length && userStatus && (<StatusSheet status_updates={statusUpdates.length ? statusUpdates : []} last_read_at={lastReadAt?.current || (Date.now()-86400000).toString()} user_status={userStatus} setStatusUpdates={setStatusUpdates} setUserStatus={setUserStatus} unreadState={unreadState} setUnreadState={setUnreadState} />)}
    </div>
    </ProtectedRoute>
  );
}
