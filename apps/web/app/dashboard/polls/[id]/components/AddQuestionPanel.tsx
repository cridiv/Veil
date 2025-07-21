"use client";
import React, { useState } from "react";
import { X, Plus, PlusCircle } from "lucide-react";
import { Question, QuestionType } from "../../../../types/poll";

interface AddQuestionPanelProps {
  onAdd: (question: Omit<Question, "id" | "pollId" | "order">) => void;
  onCancel: () => void;
}

const AddQuestionPanel: React.FC<AddQuestionPanelProps> = ({
  onAdd,
  onCancel,
}) => {
  const [questionText, setQuestionText] = useState("");
  const [questionType, setQuestionType] =
    useState<QuestionType>("multiple-choice");
  const [isRequired, setIsRequired] = useState(true);
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [maxRating, setMaxRating] = useState<number>(5);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return; // Minimum 2 options
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!questionText.trim()) {
      alert("Please enter a question");
      return;
    }

    if (
      (questionType === "multiple-choice" ||
        questionType === "single-choice") &&
      options.some((opt) => !opt.trim())
    ) {
      alert("Please fill in all options");
      return;
    }

    const newQuestion: Omit<Question, "id" | "pollId" | "order"> = {
      text: questionText,
      type: questionType,
      required: isRequired,
      options:
        questionType === "multiple-choice" || questionType === "single-choice"
          ? options
          : undefined,
      maxLength: questionType === "text" ? maxLength : undefined,
      maxRating: questionType === "rating" ? maxRating : undefined,
    };

    onAdd(newQuestion);
  };

  return (
    <div className="bg-white rounded-lg shadow mt-6 p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Add Question</h2>
        <button
          onClick={onCancel}
          className="p-1 hover:bg-gray-100 rounded-full"
          aria-label="Close"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Text
          </label>
          <input
            type="text"
            value={questionText}
            onChange={(e) => setQuestionText(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            placeholder="Enter your question here"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Question Type
          </label>
          <select
            value={questionType}
            onChange={(e) => setQuestionType(e.target.value as QuestionType)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          >
            <option value="multiple-choice">Multiple Choice</option>
            <option value="single-choice">Single Choice</option>
            <option value="text">Open Text</option>
            <option value="rating">Rating</option>
            <option value="audience-qa">Audience Q&A</option>
          </select>
        </div>

        {(questionType === "multiple-choice" ||
          questionType === "single-choice") && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Options
            </label>
            <div className="space-y-2">
              {options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    placeholder={`Option ${index + 1}`}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveOption(index)}
                    className="p-2 text-gray-500 hover:text-red-600 rounded-md hover:bg-gray-100"
                    title="Remove option"
                    disabled={options.length <= 2}
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="flex items-center text-sm text-purple-600 hover:text-purple-800 mt-2"
              >
                <PlusCircle size={16} className="mr-1" />
                Add Option
              </button>
            </div>
          </div>
        )}

        {questionType === "text" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Length (characters)
            </label>
            <input
              type="number"
              value={maxLength || ""}
              onChange={(e) =>
                setMaxLength(
                  e.target.value ? parseInt(e.target.value) : undefined
                )
              }
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Leave empty for unlimited"
              min="1"
            />
          </div>
        )}

        {questionType === "rating" && (
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Maximum Rating
            </label>
            <select
              value={maxRating}
              onChange={(e) => setMaxRating(parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="5">5 Stars</option>
              <option value="10">10 Points</option>
            </select>
          </div>
        )}

        <div className="mb-6">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={isRequired}
              onChange={(e) => setIsRequired(e.target.checked)}
              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-700">
              Required question
            </span>
          </label>
        </div>

        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
          >
            Add Question
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddQuestionPanel;
