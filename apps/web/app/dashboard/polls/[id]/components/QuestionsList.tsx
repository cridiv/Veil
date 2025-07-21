"use client";
import React, { useState } from "react";
import { Edit2, Trash2, GripVertical, Eye, EyeOff } from "lucide-react";
import { Question } from "../../../../types/poll";

interface QuestionsListProps {
  questions: Question[];
  onDelete: (questionId: string) => void;
  onUpdate: (question: Question) => void;
}

const QuestionsList: React.FC<QuestionsListProps> = ({
  questions,
  onDelete,
  onUpdate,
}) => {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const getQuestionTypeLabel = (type: Question["type"]) => {
    switch (type) {
      case "multiple-choice":
        return "Multiple Choice";
      case "single-choice":
        return "Single Choice";
      case "text":
        return "Open Text";
      case "rating":
        return "Rating";
      case "audience-qa":
        return "Audience Q&A";
      default:
        return type;
    }
  };

  const getQuestionTypeIcon = (type: Question["type"]) => {
    switch (type) {
      case "multiple-choice":
        return (
          <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">MC</span>
          </div>
        );
      case "single-choice":
        return (
          <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">SC</span>
          </div>
        );
      case "text":
        return (
          <div className="w-8 h-8 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">Aa</span>
          </div>
        );
      case "rating":
        return (
          <div className="w-8 h-8 bg-yellow-100 text-yellow-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">★</span>
          </div>
        );
      case "audience-qa":
        return (
          <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold">Q&A</span>
          </div>
        );
      default:
        return null;
    }
  };

  const toggleVisibility = (question: Question) => {
    onUpdate({
      ...question,
      isHidden: !question.isHidden,
    });
  };

  return (
    <div className="space-y-4">
      {questions.map((question) => (
        <div
          key={question.id}
          className={`border rounded-lg ${
            question.isHidden ? "border-gray-200 bg-gray-50" : "border-gray-200"
          }`}
        >
          <div className="p-4 flex items-start">
            <div className="mr-3 cursor-move">
              <GripVertical className="text-gray-400" size={20} />
            </div>

            <div className="mr-3">{getQuestionTypeIcon(question.type)}</div>

            <div className="flex-1">
              <div className="flex items-start justify-between">
                <div>
                  <h3
                    className={`font-medium ${question.isHidden ? "text-gray-500" : "text-gray-800"}`}
                  >
                    {question.text}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-500">
                    <span className="bg-gray-100 px-2 py-0.5 rounded text-xs">
                      {getQuestionTypeLabel(question.type)}
                    </span>
                    {question.required && (
                      <span className="ml-2 text-xs text-red-600">
                        Required
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => toggleVisibility(question)}
                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                    title={
                      question.isHidden ? "Show question" : "Hide question"
                    }
                  >
                    {question.isHidden ? (
                      <Eye size={18} />
                    ) : (
                      <EyeOff size={18} />
                    )}
                  </button>
                  <button
                    onClick={() =>
                      setExpandedQuestion(
                        expandedQuestion === question.id ? null : question.id
                      )
                    }
                    className="p-1.5 text-gray-500 hover:text-gray-700 rounded-md hover:bg-gray-100"
                    title="Edit question"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => onDelete(question.id)}
                    className="p-1.5 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                    title="Delete question"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>

              {question.type !== "text" &&
                question.type !== "audience-qa" &&
                question.options && (
                  <div className="mt-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {question.options.map((option, index) => (
                        <div
                          key={index}
                          className="text-sm bg-gray-50 p-2 rounded border border-gray-200"
                        >
                          {option}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              {expandedQuestion === question.id && (
                <div className="mt-4 p-4 border-t border-gray-200">
                  <div className="text-sm text-gray-500 mb-2">
                    Question editing form would go here
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default QuestionsList;
