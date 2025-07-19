"use client";

import React, { useState } from "react";
import { Poll } from "../../types/poll";

interface CreatePollModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (poll: Omit<Poll, "id" | "createdAt" | "responses">) => void;
}

const CreatePollModal: React.FC<CreatePollModalProps> = ({
  isOpen,
  onClose,
  onCreatePoll,
}) => {
  const [step, setStep] = useState(1);
  const [pollName, setPollName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [formError, setFormError] = useState("");

  // Reset form when modal is closed
  const handleClose = () => {
    setPollName("");
    setStartDate("");
    setEndDate("");
    setStep(1);
    setFormError("");
    onClose();
  };

  // Handle form submission
  const handleSubmit = () => {
    // Validate form
    if (!pollName.trim()) {
      setFormError("Please enter a poll name");
      return;
    }

    if (!startDate || !endDate) {
      setFormError("Please select start and end dates");
      return;
    }

    const start = new Date(startDate);
    const end = new Date(endDate);

    if (end < start) {
      setFormError("End date must be after start date");
      return;
    }

    // Generate a random code
    const generateCode = () => {
      const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
      let code = "";
      for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return code;
    };

    // Determine poll status
    const now = new Date();
    let status: "active" | "upcoming" | "past" = "upcoming";

    if (start <= now && end >= now) {
      status = "active";
    } else if (end < now) {
      status = "past";
    }

    // Create new poll
    onCreatePoll({
      name: pollName,
      code: generateCode(),
      status,
      startDate: new Date(startDate),
      endDate: new Date(endDate),
    });

    // Reset form
    handleClose();
  };

  // Handle date changes
  const handleDateChange = (type: "start" | "end", value: string) => {
    if (type === "start") {
      setStartDate(value);
      // Set minimum end date to start date
      const endDateInput = document.getElementById(
        "end-date"
      ) as HTMLInputElement;
      if (endDateInput) {
        endDateInput.min = value;
      }
    } else {
      setEndDate(value);
    }
    setFormError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4 text-center sm:p-0">
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75"
          onClick={handleClose}
        ></div>

        <div className="relative inline-block overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="px-4 pt-5 pb-4 bg-white sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  {step === 1
                    ? "When do you want to use this poll?"
                    : "Create Your Poll"}
                </h3>

                {/* Step 1: Select Dates */}
                {step === 1 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-4">
                      Select start and end date for your event
                    </p>

                    <div className="space-y-4 text-black">
                      <div>
                        <label
                          htmlFor="start-date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Start date
                        </label>
                        <input
                          type="date"
                          id="start-date"
                          className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          value={startDate}
                          onChange={(e) =>
                            handleDateChange("start", e.target.value)
                          }
                          min={new Date().toISOString().split("T")[0]}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="end-date"
                          className="block text-sm font-medium text-gray-700"
                        >
                          End date
                        </label>
                        <input
                          type="date"
                          id="end-date"
                          className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                          value={endDate}
                          onChange={(e) =>
                            handleDateChange("end", e.target.value)
                          }
                          min={
                            startDate || new Date().toISOString().split("T")[0]
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Enter Poll Name */}
                {step === 2 && (
                  <div className="mt-6">
                    <p className="text-sm text-gray-500 mb-4">
                      After selecting the dates, enter a name for your poll.
                    </p>

                    <div>
                      <label
                        htmlFor="poll-name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Give your Poll a name
                      </label>
                      <input
                        type="text"
                        id="poll-name"
                        className="mt-1 block w-full px-3 py-2 border text-black border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500"
                        placeholder="E.g., Team Retrospective"
                        value={pollName}
                        onChange={(e) => {
                          setPollName(e.target.value);
                          setFormError("");
                        }}
                      />
                    </div>

                    <div className="mt-4 appearance-none  px-6 py-2 font-heading rounded-[8px] w-[70%] text-sm bg-amber-400/10 border border-amber-400/20 focus-visible:bg-white/20  backdrop-blur-sm ">
                      <p className="text-xs text-amber-400">
                        Anyone with the code or link can participate
                      </p>
                    </div>
                  </div>
                )}

                {formError && (
                  <div className="mt-3 text-sm text-red-600">{formError}</div>
                )}
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 sm:px-6 sm:flex sm:flex-row-reverse">
            {step === 1 ? (
              <button
                type="button"
                className="w-full inline-flex justify-center cursor-pointer rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => {
                  if (!startDate || !endDate) {
                    setFormError("Please select both start and end dates");
                    return;
                  }
                  setStep(2);
                  setFormError("");
                }}
              >
                Next
              </button>
            ) : (
              <button
                type="button"
                className="w-full inline-flex justify-center cursor-pointer rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={handleSubmit}
              >
                Create Poll
              </button>
            )}

            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center cursor-pointer rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={handleClose}
            >
              Cancel
            </button>

            {step === 2 && (
              <button
                type="button"
                className="mt-3 w-full inline-flex justify-center cursor-pointer rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                onClick={() => setStep(1)}
              >
                Back
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreatePollModal;
