"use client";

import React, { useState } from "react";
import PollsList from "./PollsList";
import PollsHeader from "./PollsHeader";
import CreatePollModal from "./CreatePollModal";
import { Poll } from "../../types/poll";

const PollsSection: React.FC = () => {
  const [polls, setPolls] = useState<Poll[]>([
    {
      id: "1",
      name: "Team Meeting Feedback",
      code: "ABC123",
      status: "active",
      responses: 24,
      startDate: new Date("2025-07-18"),
      endDate: new Date("2025-07-25"),
      createdAt: new Date("2025-07-15"),
    },
    {
      id: "2",
      name: "Product Launch Survey",
      code: "XYZ456",
      status: "active",
      responses: 108,
      startDate: new Date("2025-07-19"),
      endDate: new Date("2025-07-30"),
      createdAt: new Date("2025-07-16"),
    },
    {
      id: "3",
      name: "Customer Satisfaction Q2",
      code: "QWE789",
      status: "past",
      responses: 214,
      startDate: new Date("2025-06-01"),
      endDate: new Date("2025-06-30"),
      createdAt: new Date("2025-05-28"),
    },
    {
      id: "4",
      name: "Annual Company Survey",
      code: "POI321",
      status: "upcoming",
      responses: 0,
      startDate: new Date("2025-08-01"),
      endDate: new Date("2025-08-15"),
      createdAt: new Date("2025-07-10"),
    },
  ]);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedPolls, setSelectedPolls] = useState<string[]>([]);
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "past">(
    "all"
  );
  const [searchQuery, setSearchQuery] = useState("");

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
