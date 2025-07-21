"use client";

import React from "react";
import { useState } from "react";
import GoogleIcon from "../svg/GoogleIcon";
import TwitterIcon from "../svg/TwitterIcon";
import JoinIcon from "../svg/JoinIcon";
import { useRouter } from "next/navigation";
import { joinRoom, setTempUser } from "../lib/api";

export const LoadingSpinner = () => {
  return (
    <svg
      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const GetStarted = () => {
  const [userName, setUserName] = useState("");
  const [roomCode, setRoomCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAuthGoogle = () => {
    console.log("Google authentication initiated");
    window.location.href = "http://localhost:5000/auth/google";
    router.push("/client-handler");
  };

  const handleAuthTwitter = () => {
    console.log("Twitter authentication initiated");
    window.location.href = "http://localhost:5000/auth/twitter";
    // Handle Twitter authentication logic here
    router.push("/client-handler");
  };

  const handleJoinRoom = () => {
    if (
      !userName ||
      !roomCode ||
      userName.trim() === "" ||
      roomCode.trim() === ""
    ) {
      setError("Please enter both your name and room code.");
      return;
    }
    setError("");
    setLoading(true);
    // send the temporary user name to the backend here if necessary tho, but i save it to local storage
    localStorage.setItem("tempUserName", userName);
    // Add a small delay to show the loading animation
    setTimeout(() => {
      window.location.href = `/room/${roomCode}`;
    }, 500);
    // Optionally, you can call an API to join the room
  };

  return (
    <div className="min-h-screen bg-base-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">
          Get Started with Veil
        </h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Join as participant column */}
          <div className="bg-purple-600 rounded-lg shadow-xl p-8 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-2">Join as a participant</h2>
            <small className="text-base-content/70 mb-6 block">
              No account needed
            </small>
            {/* Enter user name Section */}
            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Your Name</span>
              </label>
              <input
                type="text"
                placeholder="Enter your name"
                onChange={(e) => setUserName(e.target.value)}
                className="input bg-white text-black border-[2px] rounded-full border-white input-bordered w-full focus:input-primary focus:z-0"
              />
            </div>

            <div className="form-control w-full mb-6">
              <label className="label">
                <span className="label-text">Room Code</span>
              </label>
              <div className="relative w-full">
                <input
                  type="text"
                  placeholder="Enter room code"
                  onChange={(e) => setRoomCode(e.target.value)}
                  className="input bg-white text-black border-[2px] rounded-full border-white input-bordered w-full pr-24 focus:input-primary focus:z-0"
                />
                {/* add a spinning loading animation when user clicks join */}
                <button
                  className="cursor-pointer absolute right-1 top-1/2 -translate-y-1/2 z-10 bg-[#af1aff] text-white px-4 py-1.5 rounded-full flex items-center gap-1 hover:bg-[#9615e3] transition-colors border-none shadow-none outline-none"
                  style={{
                    transform: "translateY(0%)",
                    touchAction: "manipulation",
                  }}
                  onClick={handleJoinRoom}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      {" "}
                      <LoadingSpinner /> Joining...
                    </>
                  ) : (
                    <>
                      Join
                      <JoinIcon />
                    </>
                  )}
                </button>
              </div>
              <span className="text-red-600 text-sm mt-2">{error}</span>
            </div>

            <div className="mt-auto bg-base-300 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">What to expect</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Interactive polling experience</li>
                <li>Real-time responses</li>
                <li>Anonymous participation</li>
                <li>Multiple question formats</li>
              </ul>
            </div>
          </div>

          {/* Host a room column */}
          <div className="bg-white text-black rounded-lg shadow-xl p-8 flex flex-col h-full">
            <h2 className="text-2xl font-bold mb-2">Host a room</h2>
            <p className="text-base-content/70 mb-6">
              Sign in to host a room and create polls
            </p>

            <div className="space-y-4">
              <button
                onClick={handleAuthGoogle}
                className="btn bg-white text-black border-[#e5e5e5] w-full rounded-full"
              >
                <GoogleIcon />
                Sign in with Google
              </button>

              <button
                onClick={handleAuthTwitter}
                className="btn bg-black text-white border-black w-full rounded-full"
              >
                <TwitterIcon />
                Sign in with X
              </button>
            </div>

            <div className="mt-auto bg-base-300 p-4 rounded-lg">
              <h3 className="font-semibold mb-2">Host benefits</h3>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Create custom polls</li>
                <li>View detailed analytics</li>
                <li>Export results</li>
                <li>Moderate participant responses</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-12 text-center">
          <p className="text-base-content/70">
            Need help?{" "}
            <a href="#" className="text-primary hover:underline">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;
