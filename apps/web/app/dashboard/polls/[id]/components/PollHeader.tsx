"use client";
import React, { useState } from "react";
import { ArrowLeft, Share2, QrCode, Copy, Download } from "lucide-react";
import { Poll } from "../../../../types/poll";

interface PollHeaderProps {
  poll: Poll;
  isLive: boolean;
  onToggleLive: () => void;
  onBack: () => void;
}

const PollHeader: React.FC<PollHeaderProps> = ({
  poll,
  isLive,
  onToggleLive,
  onBack,
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);

  const pollUrl = `${window.location.origin}/join/${poll.code}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pollUrl);
    // Show toast notification
    alert("Link copied to clipboard!");
    setShowShareOptions(false);
  };

  const handleDownloadQR = () => {
    // In a real app, would generate and download a QR code
    alert("QR code download would happen here!");
    setShowShareOptions(false);
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div className="flex items-center space-x-3">
          <button
            onClick={onBack}
            className="p-2 rounded-full cursor-pointer hover:bg-gray-100"
            aria-label="Go back"
          >
            <ArrowLeft size={20} className="text-gray-600" />
          </button>
          <div>
            <h1 className="text-2xl text-black font-bold">{poll.name}</h1>
            <div className="flex items-center text-sm text-gray-500 mt-1">
              <span className="font-medium">Poll ID:</span>
              <span className="ml-2">{poll.id}</span>
              <span className="mx-2">•</span>
              <span className="font-medium">Code:</span>
              <span className="ml-2">{poll.code}</span>
            </div>
          </div>
        </div>

        <div className="flex space-x-3 w-full sm:w-auto">
          <div className="relative">
            <button
              onClick={() => setShowShareOptions(!showShareOptions)}
              className="px-4 py-2 bg-purple-100 cursor-pointer text-purple-700 rounded-md hover:bg-purple-200 flex items-center"
            >
              <Share2 size={16} className="mr-2" />
              Share
            </button>

            {showShareOptions && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-lg shadow-lg z-10 p-4">
                <h3 className="font-semibold mb-3">Share Poll</h3>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Joining Link</div>
                  <div className="flex">
                    <input
                      type="text"
                      value={pollUrl}
                      readOnly
                      className="flex-1 border border-gray-300 rounded-l-md px-3 py-2 text-sm bg-gray-50"
                    />
                    <button
                      onClick={handleCopyLink}
                      className="bg-purple-600 text-white p-2 rounded-r-md hover:bg-purple-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Poll Code</div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xl font-bold tracking-wide">
                      {poll.code}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(poll.code)}
                      className="p-1 hover:bg-gray-100 rounded"
                    >
                      <Copy size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
                  <div className="mb-3 w-32 h-32 bg-gray-200 flex items-center justify-center">
                    <QrCode size={64} className="text-gray-400" />
                    <span className="sr-only">QR Code</span>
                  </div>
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center text-sm text-purple-600 hover:text-purple-800"
                  >
                    <Download size={14} className="mr-1" />
                    Download QR Code
                  </button>
                </div>
              </div>
            )}
          </div>

          <button
            onClick={onToggleLive}
            className={`px-4 py-2 rounded-md cursor-pointer ${
              isLive
                ? "bg-red-100 text-red-700 hover:bg-red-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {isLive ? "End Session" : "Start Live Session"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PollHeader;
