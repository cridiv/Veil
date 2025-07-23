"use client";
import React, { useState } from "react";
import { Question, Poll } from "../../../../types/poll";
import AudienceQAManager from "./AudienceQAManager";
import ModeratorRoom from "./ModeratorRoom";
import { useWebSocketAudienceQuestions } from "../hooks/useMockAudienceQuestions";

interface AudienceQAManagerContainerProps {
  poll: Poll;
  questions: Question[];
  onClose?: () => void;
}

const AudienceQAManagerContainer: React.FC<AudienceQAManagerContainerProps> = ({
  poll,
  questions,
  onClose,
}) => {
  const [showModeratorRoom, setShowModeratorRoom] = useState(true);

  const {
    audienceQuestions,
    loading,
    handleUpvote,
    handleReply,
    handleDelete,
    handleToggleAnswered,
    handleToggleHidden,
  } = useWebSocketAudienceQuestions(poll.id);

  if (loading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  // Close moderator room and call parent onClose if provided
  const handleCloseModeratorRoom = () => {
    setShowModeratorRoom(false);
    if (onClose) {
      onClose();
    }
  };

  if (showModeratorRoom) {
    if (!questions[0]) {
      // Optionally, render a fallback UI or null if no question is available
      return null;
    }
    return (
      <ModeratorRoom
        question={questions[0]}
        audienceQuestions={audienceQuestions}
        onReply={handleReply}
        onDelete={handleDelete}
        onUpvote={handleUpvote}
        onToggleAnswered={handleToggleAnswered}
        onToggleHidden={handleToggleHidden}
        onClose={handleCloseModeratorRoom}
      />
    );
  }

  if (!questions[0]) {
       return null;
  }
  return (
    <AudienceQAManager
      question={questions[0]}
      audienceQuestions={audienceQuestions}
      onReply={handleReply}
      onDelete={handleDelete}
      onUpvote={handleUpvote}
      onToggleAnswered={handleToggleAnswered}
      onToggleHidden={handleToggleHidden}
    />
  );
};

export default AudienceQAManagerContainer;