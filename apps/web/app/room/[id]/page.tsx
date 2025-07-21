"use client";
import React, { useState, useEffect } from "react";

const RoomPage = () => {
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage only after component mounts (client-side)
    const storedName = localStorage.getItem("tempUserName");
    setUserName(storedName);

    if (!storedName) {
      // Redirect to get started page if no username is found
      window.location.href = "/get-started";
    }
  }, []);

  // Show a loading state until client-side code runs
  if (userName === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[rgb(25, 26, 31)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#af1aff] mx-auto mb-4"></div>
          <p className="text-white text-lg">Joining room...</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1>Room page</h1>
      <p>Hi {userName}, welcome to this room</p>
    </div>
  );
};

export default RoomPage;
