"use client";

import React, { useState, useEffect } from "react";
import PollsList from "./PollsList";
import PollsHeader from "./PollsHeader";
import CreatePollModal from "./CreatePollModal";
import { Poll } from "../../types/poll";

const PollsSection: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPolls, setSelectedPolls] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "past">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");


useEffect(() => {
    const fetchPolls = async () => {
      try {
        const token = localStorage.getItem("auth_token");
        if (!token) {
          console.error("No auth token found");
          return;
        }

        const res = await fetch("http://localhost:5000/rooms", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to fetch rooms");
        }

        const data = await res.json();

        // Convert rooms to Poll shape
        const mapped = data.map((room: any): Poll => ({
          id: room.id,
          name: room.name,
          slug: room.slug,
          description: room.description,
          createdAt: room.createdAt ? new Date(room.createdAt) : new Date(),
          responses: 0,
          status: "active", 
        }));

        setPolls(mapped);
      } catch (err) {
        console.error("Error fetching polls:", err);
      }
    };

    fetchPolls();
  }, []);

  // Filter polls based on status and search query
  const filteredPolls = polls.filter((poll) => {
    // Filter by status
    if (filterStatus === "active" && poll.status === "past") {
      return false;
    }
    if (filterStatus === "past" && poll.status !== "past") {
      return false;
    }

    // Filter by search query
    if (
      searchQuery &&
      !poll.name.toLowerCase().includes(searchQuery.toLowerCase())
    ) {
      return false;
    }

    return true;
  });

  // Toggle poll selection
  const togglePollSelection = (pollId: string) => {
    if (selectedPolls.includes(pollId)) {
      setSelectedPolls(selectedPolls.filter((id) => id !== pollId));
    } else {
      setSelectedPolls([...selectedPolls, pollId]);
    }
  };

  // Select all polls
  const selectAllPolls = () => {
    if (selectedPolls.length === filteredPolls.length) {
      setSelectedPolls([]);
    } else {
      setSelectedPolls(filteredPolls.map((poll) => poll.id));
    }
  };

  // Delete selected polls
  const deleteSelectedPolls = () => {
    setPolls(polls.filter((poll) => !selectedPolls.includes(poll.id)));
    setSelectedPolls([]);
  };

  // Create a new poll
  const handleCreatePoll = (
    newPoll: Omit<Poll, "id" | "createdAt" | "responses">
  ) => {
    const poll: Poll = {
      ...newPoll,
      id: `poll-${Date.now()}`,
      createdAt: new Date(),
      responses: 0,
    };
    setPolls([poll, ...polls]);
    setIsCreateModalOpen(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <PollsHeader
        onCreatePoll={() => setIsCreateModalOpen(true)}
        onDeleteSelected={deleteSelectedPolls}
        onSelectAll={selectAllPolls}
        selectedCount={selectedPolls.length}
        totalCount={filteredPolls.length}
        onFilterChange={setFilterStatus}
        currentFilter={filterStatus}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <PollsList
        polls={filteredPolls}
        selectedPolls={selectedPolls}
        onToggleSelect={togglePollSelection}
      />

      <CreatePollModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreatePoll={handleCreatePoll}
      />
    </div>
  );
};

export default PollsSection;
