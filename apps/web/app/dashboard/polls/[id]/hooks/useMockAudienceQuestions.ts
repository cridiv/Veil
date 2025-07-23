"use client";
import { useState, useEffect, useRef } from 'react';
import { io, Socket } from 'socket.io-client';
import { AudienceQuestion, AudienceReply } from "../../../../types/poll";

interface BackendQuestion {
  id: string;
  userId: string;
  roomId: string;
  question: string;
  answer?: string;
  timestamp: number;
  isAnswered?: boolean;
  isHidden?: boolean;
  upvotes?: number;
}

const transformQuestion = (backendQ: BackendQuestion): AudienceQuestion => ({
  id: backendQ.id,
  questionId: backendQ.roomId, // Using roomId as questionId for compatibility
  text: backendQ.question,
  authorName: `User ${backendQ.userId.slice(-4)}`, // Show last 4 chars of userId
  timestamp: new Date(backendQ.timestamp),
  upvotes: backendQ.upvotes || 0,
  isAnswered: backendQ.isAnswered || false,
  isHidden: backendQ.isHidden || false,
  replies: backendQ.answer ? [{
    id: `reply-${backendQ.id}`,
    audienceQuestionId: backendQ.id,
    text: backendQ.answer,
    authorName: "Moderator",
    authorId: "moderator",
    timestamp: new Date(backendQ.timestamp + 1000), // Slightly after question
    isOfficial: true,
  }] : [],
});

export const useWebSocketAudienceQuestions = (questionId: string) => {
  const [audienceQuestions, setAudienceQuestions] = useState<AudienceQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [connected, setConnected] = useState(false);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    // Initialize WebSocket connection
    const socket = io(process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001', {
      transports: ['websocket', 'polling']
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('🟢 Connected to WebSocket server');
      setConnected(true);
      
      // Join the room for this question/poll
      socket.emit('joinRoom', { 
        roomId: questionId, 
        userId: `moderator-${Date.now()}` 
      });

      // Request existing questions
      socket.emit('getQuestions', { roomId: questionId });
    });

    socket.on('disconnect', () => {
      console.log('🔴 Disconnected from WebSocket server');
      setConnected(false);
    });

    // Listen for existing questions list
    socket.on('questionsList', (questions: BackendQuestion[]) => {
      console.log('📋 Received questions list:', questions);
      const transformedQuestions = questions.map(transformQuestion);
      setAudienceQuestions(transformedQuestions);
      setLoading(false);
    });

    // Listen for new questions
    socket.on('newQuestion', (question: BackendQuestion) => {
      console.log('📝 New question received:', question);
      const transformedQuestion = transformQuestion(question);
      setAudienceQuestions(prev => [...prev, transformedQuestion]);
    });

    // Listen for question updates (upvotes, answered status, etc.)
    socket.on('questionUpdated', (updatedQuestion: BackendQuestion) => {
      console.log('🔄 Question updated:', updatedQuestion);
      const transformedQuestion = transformQuestion(updatedQuestion);
      setAudienceQuestions(prev => 
        prev.map(q => q.id === updatedQuestion.id ? transformedQuestion : q)
      );
    });

    // Listen for question replies
    socket.on('questionReplied', (repliedQuestion: BackendQuestion) => {
      console.log('💬 Question replied:', repliedQuestion);
      const transformedQuestion = transformQuestion(repliedQuestion);
      setAudienceQuestions(prev => 
        prev.map(q => q.id === repliedQuestion.id ? transformedQuestion : q)
      );
    });

    // Listen for question deletions
    socket.on('questionDeleted', (deletedQuestionId: string) => {
      console.log('🗑️ Question deleted:', deletedQuestionId);
      setAudienceQuestions(prev => 
        prev.filter(q => q.id !== deletedQuestionId)
      );
    });

    socket.on('connect_error', (error) => {
      console.error('❌ WebSocket connection error:', error);
      setLoading(false);
    });

    return () => {
      socket.disconnect();
    };
  }, [questionId]);

  // Function to handle upvoting a question
  const handleUpvote = (audienceQuestionId: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('upvoteQuestion', {
        roomId: questionId,
        questionId: audienceQuestionId
      });
    }
  };

  // Function to handle adding a reply to a question
  const handleReply = (audienceQuestionId: string, replyText: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('replyToQuestion', {
        roomId: questionId,
        questionId: audienceQuestionId,
        content: replyText
      });
    }
  };

  // Function to handle deleting a question
  const handleDelete = (audienceQuestionId: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('deleteQuestion', {
        roomId: questionId,
        questionId: audienceQuestionId
      });
    }
  };

  // Function to toggle answered status
  const handleToggleAnswered = (audienceQuestionId: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('toggleAnswered', {
        roomId: questionId,
        questionId: audienceQuestionId
      });
    }
  };

  // Function to toggle hidden status
  const handleToggleHidden = (audienceQuestionId: string) => {
    if (socketRef.current && connected) {
      socketRef.current.emit('toggleHidden', {
        roomId: questionId,
        questionId: audienceQuestionId
      });
    }
  };

  return {
    audienceQuestions,
    loading,
    connected,
    handleUpvote,
    handleReply,
    handleDelete,
    handleToggleAnswered,
    handleToggleHidden,
  };
};