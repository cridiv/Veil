"use client";
import React, { useState, useEffect } from "react";
import { Question } from "../../../../types/poll";
import { AudienceQuestion, AudienceReply } from "../../../../types/audience-qa";

// This would typically be fetched from an API
export const useMockAudienceQuestions = (questionId: string) => {
  const [audienceQuestions, setAudienceQuestions] = useState<
    AudienceQuestion[]
  >([]);
  const [loading, setLoading] = useState(true);

  // Generate mock audience questions for a specific question
  useEffect(() => {
    // Simulate API fetch delay
    const timer = setTimeout(() => {
      if (questionId) {
        const mockData: AudienceQuestion[] = [
          {
            id: "aq1",
            questionId: questionId,
            text: "Can you elaborate more on the specific use cases?",
            authorName: "Alex Johnson",
            authorId: "user123",
            timestamp: new Date(Date.now() - 15 * 60000), // 15 minutes ago
            upvotes: 12,
            isAnswered: true,
            replies: [
              {
                id: "reply1",
                audienceQuestionId: "aq1",
                text: "Great question! Our product is designed for both individual creators and enterprise teams. For individuals, it helps with content scheduling and analytics. For enterprises, it offers team collaboration and approval workflows.",
                authorName: "Sam Smith",
                authorId: "mod456",
                timestamp: new Date(Date.now() - 10 * 60000), // 10 minutes ago
                isOfficial: true,
              },
            ],
          },
          {
            id: "aq2",
            questionId: questionId,
            text: "Is there a free trial available?",
            authorName: "Taylor Williams",
            authorId: "user456",
            timestamp: new Date(Date.now() - 8 * 60000), // 8 minutes ago
            upvotes: 8,
            isAnswered: false,
            replies: [],
          },
          {
            id: "aq3",
            questionId: questionId,
            text: "How does this compare to competitor X?",
            authorName: "Jamie Lee",
            authorId: "user789",
            timestamp: new Date(Date.now() - 5 * 60000), // 5 minutes ago
            upvotes: 5,
            isAnswered: false,
            isHidden: true,
            replies: [],
          },
          {
            id: "aq4",
            questionId: questionId,
            text: "When will the mobile app be released?",
            authorName: "Anonymous Attendee",
            timestamp: new Date(Date.now() - 3 * 60000), // 3 minutes ago
            upvotes: 3,
            isAnswered: false,
            replies: [],
          },
        ];

        setAudienceQuestions(mockData);
      }
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [questionId]);

  // Function to handle upvoting a question
  const handleUpvote = (questionId: string) => {
    setAudienceQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, upvotes: q.upvotes + 1 } : q
      )
    );
  };

  // Function to handle adding a reply to a question
  const handleReply = (questionId: string, replyText: string) => {
    const newReply: AudienceReply = {
      id: `reply-${Date.now()}`,
      audienceQuestionId: questionId,
      text: replyText,
      authorName: "You (Moderator)",
      authorId: "current-moderator",
      timestamp: new Date(),
      isOfficial: true,
    };

    setAudienceQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, replies: [...q.replies, newReply] } : q
      )
    );
  };

  // Function to handle deleting a question
  const handleDelete = (questionId: string) => {
    setAudienceQuestions((prevQuestions) =>
      prevQuestions.filter((q) => q.id !== questionId)
    );
  };

  // Function to toggle answered status
  const handleToggleAnswered = (questionId: string) => {
    setAudienceQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, isAnswered: !q.isAnswered } : q
      )
    );
  };

  // Function to toggle hidden status
  const handleToggleHidden = (questionId: string) => {
    setAudienceQuestions((prevQuestions) =>
      prevQuestions.map((q) =>
        q.id === questionId ? { ...q, isHidden: !q.isHidden } : q
      )
    );
  };

  return {
    audienceQuestions,
    loading,
    handleUpvote,
    handleReply,
    handleDelete,
    handleToggleAnswered,
    handleToggleHidden,
  };
};
