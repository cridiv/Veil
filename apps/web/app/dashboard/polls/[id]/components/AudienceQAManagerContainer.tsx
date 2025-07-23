"use client";
import React, { useState } from "react";
import { Question } from "../../../../types/poll";
import AudienceQAManager from "./AudienceQAManager";
import ModeratorRoom from "./ModeratorRoom";
import { useWebSocketAudienceQuestions } from "../hooks/useMockAudienceQuestions";

interface AudienceQAManagerContainerProps {
  question: Question;
  onClose?: () => void;
}

const AudienceQAManagerContainer: React.FC<AudienceQAManagerContainerProps> = ({
  question,
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
  } = useWebSocketAudienceQuestions(question.id);

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
    return (
      <ModeratorRoom
        question={question}
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

  return (
    <AudienceQAManager
      question={question}
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