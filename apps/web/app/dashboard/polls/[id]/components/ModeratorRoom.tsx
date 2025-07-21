"use client";
import React, { useState, useEffect } from "react";
import {
  MessageCircle,
  ThumbsUp,
  Trash2,
  CheckCircle,
  EyeOff,
  Clock,
  ChevronDown,
  ChevronUp,
  Send,
  Users,
  Bell,
  UserCircle,
  Filter,
  ArrowLeft,
  MoreVertical,
  UserPlus,
} from "lucide-react";
import { Question } from "../../../../types/poll";
import { AudienceQuestion, AudienceReply } from "../../../../types/audience-qa";

interface ModeratorRoomProps {
  question: Question;
  audienceQuestions: AudienceQuestion[];
  onReply: (questionId: string, reply: string) => void;
  onDelete: (questionId: string) => void;
  onUpvote: (questionId: string) => void;
  onToggleAnswered: (questionId: string) => void;
  onToggleHidden: (questionId: string) => void;
  onClose: () => void;
}

const ModeratorRoom: React.FC<ModeratorRoomProps> = ({
  question,
  audienceQuestions,
  onReply,
  onDelete,
  onUpvote,
  onToggleAnswered,
  onToggleHidden,
  onClose,
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(
    new Set()
  );
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  const [filter, setFilter] = useState<"all" | "answered" | "unanswered">(
    "all"
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [activeAudience, setActiveAudience] = useState(24); // Mock active audience count
  const [incomingQuestion, setIncomingQuestion] =
    useState<AudienceQuestion | null>(null);

  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Toggle expanded state of a question
  const toggleExpanded = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions);
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId);
    } else {
      newExpanded.add(questionId);
    }
    setExpandedQuestions(newExpanded);
  };

  // Handle reply submission
  const handleReply = (questionId: string) => {
    const reply = replyText[questionId];
    if (reply && reply.trim()) {
      onReply(questionId, reply.trim());
      setReplyText({ ...replyText, [questionId]: "" });
    }
  };

  // Filter questions based on current filter and search term
  const filteredQuestions = audienceQuestions
    .filter((q) => {
      if (filter === "answered") return q.isAnswered;
      if (filter === "unanswered") return !q.isAnswered;
      return true;
    })
    .filter(
      (q) =>
        searchTerm === "" ||
        q.text.toLowerCase().includes(searchTerm.toLowerCase()) ||
        q.authorName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => b.upvotes - a.upvotes); // Sort by upvotes (highest first)

  // Simulate new incoming questions every 8-20 seconds
  useEffect(() => {
    const simulateIncomingQuestion = () => {
      const names = [
        "Jordan Lee",
        "Taylor Kim",
        "Riley Smith",
        "Alex Morgan",
        "Casey Williams",
      ];
      const questions = [
        "Can you explain how the pricing model works?",
        "Will this be available internationally?",
        "Is there an API for developers?",
        "How does this compare to your competitors?",
        "Are there any upcoming features planned?",
      ];

      const randomName = names[Math.floor(Math.random() * names.length)];
      const randomQuestion =
        questions[Math.floor(Math.random() * questions.length)];

      const newQuestion: AudienceQuestion = {
        id: `new-${Date.now()}`,
        questionId: question.id,
        text: randomQuestion,
        authorName: randomName,
        timestamp: new Date(),
        upvotes: 0,
        isAnswered: false,
        replies: [],
      };

      setIncomingQuestion(newQuestion);

      // Hide the notification after 5 seconds
      setTimeout(() => {
        setIncomingQuestion(null);
      }, 5000);
    };

    const interval = setInterval(() => {
      const randomDelay = Math.floor(Math.random() * 12000) + 8000; // Random between 8-20 seconds
      setTimeout(simulateIncomingQuestion, randomDelay);
    }, 20000);

    // Simulate first question coming in after 3 seconds
    const initialTimeout = setTimeout(simulateIncomingQuestion, 3000);

    return () => {
      clearInterval(interval);
      clearTimeout(initialTimeout);
    };
  }, [question.id]);

  // Simulate audience count changes
  useEffect(() => {
    const interval = setInterval(() => {
      setActiveAudience((prev) => {
        const change = Math.floor(Math.random() * 3) - 1; // -1, 0, or 1
        return Math.max(prev + change, 1); // Ensure at least 1 audience member
      });
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-white z-50 overflow-hidden flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 text-gray-600 cursor-pointer hover:text-gray-900 hover:bg-gray-100 rounded-full"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              Moderator Room
            </h1>
            <p className="text-sm text-gray-600">Managing: {question.text}</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="flex items-center bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm">
            <Users size={16} className="mr-1" />
            <span>{activeAudience} active</span>
          </div>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <UserPlus size={20} />
          </button>
          <button className="p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-full">
            <MoreVertical size={20} />
          </button>
        </div>
      </header>

      {/* Incoming question notification */}
      {incomingQuestion && (
        <div className="fixed top-16 right-4 max-w-sm bg-purple-600 text-white p-4 rounded-lg shadow-lg animate-slide-in-right">
          <div className="flex items-start">
            <Bell size={20} className="mr-2 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-medium">New Question</p>
              <p className="text-sm text-purple-100 line-clamp-2">
                {incomingQuestion.text}
              </p>
              <p className="text-xs mt-1 text-purple-200">
                From {incomingQuestion.authorName}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Search and filter bar */}
      <div className="bg-gray-50 border-b text-black border-gray-200 px-4 py-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="relative w-full sm:max-w-md">
            <input
              type="text"
              placeholder="Search questions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1 text-gray-600">
              <Filter size={16} />
              <span className="text-sm">Filter:</span>
            </div>
            <div className="flex border border-gray-300 rounded-md overflow-hidden">
              <button
                onClick={() => setFilter("all")}
                className={`px-3 py-1.5 text-sm ${filter === "all" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                All
              </button>
              <button
                onClick={() => setFilter("answered")}
                className={`px-3 py-1.5 text-sm ${filter === "answered" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                Answered
              </button>
              <button
                onClick={() => setFilter("unanswered")}
                className={`px-3 py-1.5 text-sm ${filter === "unanswered" ? "bg-purple-600 text-white" : "bg-white text-gray-700 hover:bg-gray-50"}`}
              >
                Unanswered
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-between mt-3 text-sm text-gray-500">
          <span>{audienceQuestions.length} questions received</span>
          <div className="flex space-x-4">
            <span>
              {audienceQuestions.filter((q) => q.isAnswered).length} answered
            </span>
            <span>
              {audienceQuestions.filter((q) => !q.isHidden).length} visible
            </span>
          </div>
        </div>
      </div>

      {/* Questions List */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {filteredQuestions.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
            {searchTerm || filter !== "all" ? (
              <>
                <p className="text-gray-500">No matching questions found.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Try adjusting your search or filter.
                </p>
              </>
            ) : (
              <>
                <p className="text-gray-500">No audience questions yet.</p>
                <p className="text-sm text-gray-400 mt-1">
                  Questions will appear here when audience members submit them.
                </p>
              </>
            )}
          </div>
        ) : (
          <div className="space-y-4 max-w-3xl mx-auto">
            {filteredQuestions.map((audienceQuestion) => (
              <div
                key={audienceQuestion.id}
                className={`border rounded-lg overflow-hidden ${
                  audienceQuestion.isHidden
                    ? "bg-gray-100 border-gray-200"
                    : "bg-white border-gray-200"
                } ${audienceQuestion.isAnswered ? "border-l-4 border-l-green-500" : ""} shadow-sm hover:shadow transition-shadow duration-200`}
              >
                <div className="p-4">
                  <div className="flex justify-between">
                    <div className="flex items-start space-x-3">
                      <div className="flex flex-col items-center px-1">
                        <button
                          onClick={() => onUpvote(audienceQuestion.id)}
                          className="text-gray-400 hover:text-purple-600 transition-colors"
                          title="Upvote this question"
                        >
                          <ThumbsUp size={18} />
                        </button>
                        <span className="text-sm font-medium mt-1">
                          {audienceQuestion.upvotes}
                        </span>
                      </div>

                      <div className="flex-1">
                        <div className="flex items-start">
                          <UserCircle
                            size={20}
                            className="text-gray-400 mr-2 mt-1 flex-shrink-0"
                          />
                          <div>
                            <p
                              className={`text-base ${audienceQuestion.isHidden ? "text-gray-500" : "text-gray-800"}`}
                            >
                              {audienceQuestion.text}
                            </p>
                            <div className="flex items-center mt-1 text-xs text-gray-500">
                              <span className="font-medium">
                                {audienceQuestion.authorName}
                              </span>
                              <span className="mx-1">•</span>
                              <span className="flex items-center">
                                <Clock size={12} className="mr-1" />
                                {formatTime(audienceQuestion.timestamp)}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-1">
                      <button
                        onClick={() => onToggleAnswered(audienceQuestion.id)}
                        className={`p-1.5 cursor-pointer rounded-md hover:bg-gray-100 ${
                          audienceQuestion.isAnswered
                            ? "text-green-600"
                            : "text-gray-400 hover:text-green-600"
                        }`}
                        title={
                          audienceQuestion.isAnswered
                            ? "Mark as unanswered"
                            : "Mark as answered"
                        }
                      >
                        <CheckCircle size={18} />
                      </button>

                      <button
                        onClick={() => onToggleHidden(audienceQuestion.id)}
                        className={`p-1.5 cursor-pointer rounded-md hover:bg-gray-100 ${
                          audienceQuestion.isHidden
                            ? "text-gray-600"
                            : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={
                          audienceQuestion.isHidden
                            ? "Show to audience"
                            : "Hide from audience"
                        }
                      >
                        <EyeOff size={18} />
                      </button>

                      <button
                        onClick={() => onDelete(audienceQuestion.id)}
                        className="p-1.5 text-gray-400 cursor-pointer hover:text-red-600 rounded-md hover:bg-gray-100"
                        title="Delete question"
                      >
                        <Trash2 size={18} />
                      </button>

                      <button
                        onClick={() => toggleExpanded(audienceQuestion.id)}
                        className="p-1.5 text-gray-400 cursor-pointer hover:text-gray-600 rounded-md hover:bg-gray-100"
                        title={
                          expandedQuestions.has(audienceQuestion.id)
                            ? "Collapse"
                            : "Expand"
                        }
                      >
                        {expandedQuestions.has(audienceQuestion.id) ? (
                          <ChevronUp size={18} />
                        ) : (
                          <ChevronDown size={18} />
                        )}
                      </button>
                    </div>
                  </div>

                  {expandedQuestions.has(audienceQuestion.id) && (
                    <div className="mt-4 pl-10">
                      {audienceQuestion.replies.length > 0 ? (
                        <div className="space-y-3 mb-4">
                          {audienceQuestion.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`p-3 rounded-lg text-sm ${
                                reply.isOfficial
                                  ? "bg-purple-50 border border-purple-100"
                                  : "bg-gray-50 border border-gray-100"
                              }`}
                            >
                              <p className="text-gray-800">{reply.text}</p>
                              <div className="flex items-center mt-1 text-xs text-gray-500">
                                <span
                                  className={`font-medium ${reply.isOfficial ? "text-purple-700" : ""}`}
                                >
                                  {reply.authorName}{" "}
                                  {reply.isOfficial && "(Moderator)"}
                                </span>
                                <span className="mx-1">•</span>
                                <span>{formatTime(reply.timestamp)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">
                          No replies yet
                        </p>
                      )}

                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Type your reply..."
                            value={replyText[audienceQuestion.id] || ""}
                            onChange={(e) =>
                              setReplyText({
                                ...replyText,
                                [audienceQuestion.id]: e.target.value,
                              })
                            }
                            className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(audienceQuestion.id);
                              }
                            }}
                          />
                          <MessageCircle
                            size={16}
                            className="absolute right-3 top-2.5 text-gray-400"
                          />
                        </div>
                        <button
                          onClick={() => handleReply(audienceQuestion.id)}
                          disabled={!replyText[audienceQuestion.id]?.trim()}
                          className={`p-2 rounded-md  ${
                            replyText[audienceQuestion.id]?.trim()
                              ? "bg-purple-600 text-white hover:bg-purple-700 cursor-pointer"
                              : "bg-gray-200 text-gray-500 cursor-not-allowed"
                          }`}
                          title="Send reply"
                        >
                          <Send size={18} />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ModeratorRoom;
