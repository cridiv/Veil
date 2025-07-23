"use client";
import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import PollHeader from "./components/PollHeader";
import QuestionsList from "./components/QuestionsList";
import AddQuestionPanel from "./components/AddQuestionPanel";
import PollStats from "./components/PollStats";
import LoadingSkeleton from "./components/LoadingSkeleton";
import AudienceQAManagerContainer from "./components/AudienceQAManagerContainer";
import { socket } from "../../../lib/socket";
import { Poll, Question, QuestionType } from "../../../types/poll";

const PollDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const pollId = params.id as string;
  const slug = params.slug as string;

  const [isLoading, setIsLoading] = useState(true);
  const [poll, setPoll] = useState<Poll | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLive, setIsLive] = useState(false);
  const [isAddingQuestion, setIsAddingQuestion] = useState(false);
  const [newModeratorQuestion, setNewModeratorQuestion] = useState("");
  const [moderatorQuestions, setModeratorQuestions] = useState<Question[]>([]);
  const [selectedAudienceQAQuestion, setSelectedAudienceQAQuestion] =
    useState<Question | null>(null);

useEffect(() => {
  const userId = localStorage.getItem("auth_token");
  socket.emit("joinRoom", { roomId: pollId, userId});

  socket.emit("getQuestions", { roomId: pollId });

  socket.on("questionsList", (data) => {
    setQuestions(data);
    setIsLoading(false);
    setPoll({
      id: pollId,
      name: "Live Poll",
      slug: slug,
      status: "active",
      responses: data.length,
      createdAt: new Date(),
    });
  });

  const handleNewQuestion = (question: Question) => {
  setQuestions((prev) => [question, ...prev]);
};
  
  socket.on("newQuestion", handleNewQuestion);

  socket.on("questionUpdated", (updated) => {
    setQuestions((prev) =>
      prev.map((q) => (q.id === updated.id ? updated : q))
    );
  });

  socket.on("questionDeleted", (id) => {
    setQuestions((prev) => prev.filter((q) => q.id !== id));
  });

  return () => {
    socket.off("questionsList");
    socket.off("newQuestion", handleNewQuestion);
    socket.off("questionUpdated");
    socket.off("questionDeleted");
  };
}, [pollId]);

const handleModeratorSubmit = () => {
  if (!newModeratorQuestion.trim()) return;

  const userId = localStorage.getItem("auth_token"); // or "moderator" or session ID

  socket.emit("askQuestion", {
    roomId: pollId,
    userId: userId ?? "moderator",
    question: newModeratorQuestion,
  });

  setNewModeratorQuestion("");
};


const handleDeleteQuestion = (questionId: string) => {
  socket.emit("deleteQuestion", {
    roomId: pollId,
    questionId,
  });
};

const handleUpdateQuestion = (updatedQuestion: Question) => {
  socket.emit("replyToQuestion", {
    roomId: pollId,
    questionId: updatedQuestion.id,
    content: updatedQuestion.text || "",
  });
};

  const handleSelectAudienceQAQuestion = (question: Question) => {
    if (question.type === "audience-qa") {
      setSelectedAudienceQAQuestion(
        selectedAudienceQAQuestion?.id === question.id ? null : question
      );
    }
  };

  const toggleLiveStatus = () => {
    setIsLive(!isLive);
    // In a real app, would make API call to start/stop the live session
  };

  const returnToPreviousPage = () => {
    router.back();
  };

  if (isLoading) {
    return <LoadingSkeleton />;
  }

  if (!poll) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <h1 className="text-2xl font-bold text-red-600">Poll not found</h1>
        <button
          onClick={returnToPreviousPage}
          className="mt-4 px-4 py-2 bg-purple-600 cursor-pointer text-white rounded-md hover:bg-purple-700"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <PollHeader
        poll={poll}
        isLive={isLive}
        onToggleLive={toggleLiveStatus}
        onBack={returnToPreviousPage}
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-black font-semibold">Questions</h2>
              <button
                onClick={() => setIsAddingQuestion(true)}
                className="px-4 py-2 cursor-pointer bg-purple-600 text-white rounded-md hover:bg-purple-700"
              >
                Add Question
              </button>
            </div>

            {questions.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  No questions added yet. Add your first question to get
                  started.
                </p>
              </div>
            ) : (
              <QuestionsList
                questions={questions}
                onDelete={handleDeleteQuestion}
                onUpdate={handleUpdateQuestion}
                onSelectAudienceQA={handleSelectAudienceQAQuestion}
                selectedAudienceQAId={selectedAudienceQAQuestion?.id}
              />
            )}
          </div>
        </div>

        <div className="lg:col-span-1">
          <PollStats poll={poll} />
        </div>
      </div>

      {/* Audience Q&A Manager */}
      {selectedAudienceQAQuestion && (
        <AudienceQAManagerContainer
          question={selectedAudienceQAQuestion}
          onClose={() => setSelectedAudienceQAQuestion(null)}
        />
      )}

      {isAddingQuestion && (
        <AddQuestionPanel
          roomId={pollId}
          moderatorId={localStorage.getItem("auth_token") ?? "moderator"}
          onAdd={handleModeratorSubmit}
          onCancel={() => setIsAddingQuestion(false)}
        />
      )}
    </div>
  );
};

export default PollDetailPage;
