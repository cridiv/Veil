"use client";
import React, { useState, useRef, useEffect } from "react";
import { X, Plus, PlusCircle } from "lucide-react";
import { Question, QuestionType } from "../../../../types/poll";
import { socket } from "../../../../lib/socket";

interface AddQuestionPanelProps {
  roomId: string;
  moderatorId: string;
  onAdd: () => void;
  onCancel: () => void;
}

const AddQuestionPanel: React.FC<AddQuestionPanelProps> = ({
  roomId,
  moderatorId,
  onAdd,
  onCancel,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [questionText, setQuestionText] = useState("");
  const [isRequired, setIsRequired] = useState(true);
  const [options, setOptions] = useState<string[]>(["", ""]);
  const [maxLength, setMaxLength] = useState<number | undefined>(undefined);
  const [maxRating, setMaxRating] = useState<number>(5);
  const questionType: QuestionType = "text";


  // Handle click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        onCancel();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.body.style.overflow = "auto";
    };
  }, [onCancel]);

  // Handle ESC key to close
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onCancel();
      }
    };

    window.addEventListener("keydown", handleEsc);

    return () => {
      window.removeEventListener("keydown", handleEsc);
    };
  }, [onCancel]);

  // Reset form when component unmounts
  useEffect(() => {
    return () => {
      setQuestionText("");
      setIsRequired(true);
      setOptions(["", ""]);
      setMaxLength(undefined);
      setMaxRating(5);
    };
  }, []);

  const handleAddOption = () => {
    setOptions([...options, ""]);
  };

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index: number) => {
    if (options.length <= 2) return;
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };
const handleSubmit = (e: React.FormEvent) => {
  e.preventDefault();

  if (!questionText.trim()) {
    alert("Please enter a question");
    return;
  }

  socket.emit("askQuestion", {
    roomId,
    userId: moderatorId,
    question: questionText,
  });
  onAdd();
  onCancel();
};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
      <div
        ref={modalRef}
        className="bg-white backdrop-blur-md border border-purple-900/30 rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 shadow-2xl shadow-blue-900/20 transform transition-all animate-fade-in"
      >
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-black">Add Question</h2>
          <button
            onClick={onCancel}
            className="text-gray-400 cursor-pointer hover:text-black transition-colors"
            aria-label="Close"
          >
            <X size={20} />
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
              className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="Enter your question here"
              required
            />
          </div>

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
                className="w-full px-3 py-2 border text-black border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Leave empty for unlimited"
                min="1"
              />
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
              className="px-4 py-2 rounded-md cursor-pointer border-[2px] border-gray-700 text-black hover:text-white hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-md cursor-pointer bg-purple-600/80 hover:bg-purple-700 text-white transition-colors"
            >
              Add Question
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddQuestionPanel;
