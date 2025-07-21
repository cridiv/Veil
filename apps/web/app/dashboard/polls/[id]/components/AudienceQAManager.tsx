"use client";
import React, { useState } from "react";
import { 
  MessageCircle, 
  ThumbsUp, 
  Trash2, 
  CheckCircle, 
  EyeOff, 
  Clock, 
  ChevronDown, 
  ChevronUp,
  Send
} from "lucide-react";
import { Question } from "../../../../types/poll";
import { AudienceQuestion, AudienceReply } from "../../../../types/audience-qa";

interface AudienceQAManagerProps {
  question: Question;
  audienceQuestions: AudienceQuestion[];
  onReply: (questionId: string, reply: string) => void;
  onDelete: (questionId: string) => void;
  onUpvote: (questionId: string) => void;
  onToggleAnswered: (questionId: string) => void;
  onToggleHidden: (questionId: string) => void;
}

const AudienceQAManager: React.FC<AudienceQAManagerProps> = ({
  question,
  audienceQuestions,
  onReply,
  onDelete,
  onUpvote,
  onToggleAnswered,
  onToggleHidden
}) => {
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set());
  const [replyText, setReplyText] = useState<Record<string, string>>({});
  
  // Format timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
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
      setReplyText({...replyText, [questionId]: ""});
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      <h3 className="text-lg font-semibold mb-4">Audience Questions for: "{question.text}"</h3>
      
      {audienceQuestions.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border border-dashed border-gray-300">
          <p className="text-gray-500">No audience questions yet.</p>
          <p className="text-sm text-gray-400 mt-1">Questions will appear here when audience members submit them.</p>
        </div>
      ) : (
        <div>
          <div className="flex justify-between mb-3 text-sm text-gray-500">
            <span>{audienceQuestions.length} questions received</span>
            <div className="flex space-x-4">
              <span>{audienceQuestions.filter(q => q.isAnswered).length} answered</span>
              <span>{audienceQuestions.filter(q => !q.isHidden).length} visible</span>
            </div>
          </div>
          
          {audienceQuestions
            .sort((a, b) => b.upvotes - a.upvotes) // Sort by upvotes (highest first)
            .map((audienceQuestion) => (
              <div 
                key={audienceQuestion.id} 
                className={`border rounded-lg mb-3 overflow-hidden ${
                  audienceQuestion.isHidden ? "bg-gray-50 border-gray-200" : "bg-white border-gray-200"
                } ${audienceQuestion.isAnswered ? "border-l-4 border-l-green-500" : ""}`}
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
                        <span className="text-sm font-medium mt-1">{audienceQuestion.upvotes}</span>
                      </div>
                      
                      <div className="flex-1">
                        <p className={`text-base ${audienceQuestion.isHidden ? "text-gray-500" : "text-gray-800"}`}>
                          {audienceQuestion.text}
                        </p>
                        <div className="flex items-center mt-1 text-xs text-gray-500">
                          <span className="font-medium">{audienceQuestion.authorName}</span>
                          <span className="mx-1">•</span>
                          <span className="flex items-center">
                            <Clock size={12} className="mr-1" />
                            {formatTime(audienceQuestion.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-1">
                      <button
                        onClick={() => onToggleAnswered(audienceQuestion.id)}
                        className={`p-1.5 cursor-pointer rounded-md hover:bg-gray-100 ${
                          audienceQuestion.isAnswered ? "text-green-600" : "text-gray-400 hover:text-green-600"
                        }`}
                        title={audienceQuestion.isAnswered ? "Mark as unanswered" : "Mark as answered"}
                      >
                        <CheckCircle size={18} />
                      </button>
                      
                      <button
                        onClick={() => onToggleHidden(audienceQuestion.id)}
                        className={`p-1.5 cursor-pointer rounded-md hover:bg-gray-100 ${
                          audienceQuestion.isHidden ? "text-gray-600" : "text-gray-400 hover:text-gray-600"
                        }`}
                        title={audienceQuestion.isHidden ? "Show to audience" : "Hide from audience"}
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
                        title={expandedQuestions.has(audienceQuestion.id) ? "Collapse" : "Expand"}
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
                                <span className={`font-medium ${reply.isOfficial ? "text-purple-700" : ""}`}>
                                  {reply.authorName} {reply.isOfficial && "(Moderator)"}
                                </span>
                                <span className="mx-1">•</span>
                                <span>{formatTime(reply.timestamp)}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 mb-3">No replies yet</p>
                      )}
                      
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 relative">
                          <input
                            type="text"
                            placeholder="Type your reply..."
                            value={replyText[audienceQuestion.id] || ""}
                            onChange={(e) => setReplyText({
                              ...replyText,
                              [audienceQuestion.id]: e.target.value
                            })}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 pr-10"
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleReply(audienceQuestion.id);
                              }
                            }}
                          />
                          <MessageCircle size={16} className="absolute right-3 top-2.5 text-gray-400" />
                        </div>
                        <button
                          onClick={() => handleReply(audienceQuestion.id)}
                          disabled={!replyText[audienceQuestion.id]?.trim()}
                          className={`p-2 rounded-md ${
                            replyText[audienceQuestion.id]?.trim()
                              ? "bg-purple-600 text-white hover:bg-purple-700"
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
  );
};

export default AudienceQAManager;
