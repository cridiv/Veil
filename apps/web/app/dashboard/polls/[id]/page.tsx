"use client";
import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import AudienceQAManagerContainer from "./components/AudienceQAManagerContainer";
import LoadingSkeleton from "./components/LoadingSkeleton";
import { Poll, Question } from "../../../types/poll";
import { socket } from "../../../lib/socket";

const PollDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [audienceQuestions, setAudienceQuestions] = useState<Question[]>([]);

 useEffect(() => {
  const roomId = pollId;

  socket.emit("joinRoom", { roomId, userId: "moderator" });

  socket.emit("getQuestions", { roomId });

  socket.on("questionsList", (data) => {
    setAudienceQuestions(data);
    setIsLoading(false);
  });
  return () => {
    socket.off("questionsList");
    socket.disconnect();
  };
  }, [pollId]);

  if (isLoading) return <LoadingSkeleton />;

  if (!poll || audienceQuestions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Audience Q&A not found</h1>
        <button
          onClick={() => router.back()}
          className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <AudienceQAManagerContainer
      poll={poll}
      questions={audienceQuestions}
      onClose={() => router.back()}
    />
  );
};

export default PollDetailPage;
