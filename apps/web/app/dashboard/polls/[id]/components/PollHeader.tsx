"use client";
import React, { useState, useRef } from "react";
import { ArrowLeft, Share2, QrCode, Copy, Download } from "lucide-react";
import { Poll } from "../../../../types/poll";
import QRCode from "react-qr-code";

interface PollHeaderProps {
  poll: Poll;
  isLive: boolean;
  onToggleLive: () => void;
  onBack: () => void;
}

interface QRCodeComponentProps {
  value: string;
  size?: number;
  qrRef: React.RefObject<HTMLDivElement | null>;
}

// Move the ref to be passed as a prop
export function QRCodeComponent({ value, size, qrRef }: QRCodeComponentProps) {
  return (
    <div ref={qrRef}>
      <QRCode
        size={128}
        style={{ height: "auto", maxWidth: "100%", width: "100%" }}
        value={value}
        viewBox={`0 0 256 256`}
      />
    </div>
  );
}

const PollHeader: React.FC<PollHeaderProps> = ({
  poll,
  isLive,
  onToggleLive,
  onBack,
}) => {
  const [showShareOptions, setShowShareOptions] = useState(false);
  // Move the ref inside the component
  const qrRef = useRef<HTMLDivElement>(null);

  const handleOnBlur = () => {
    setShowShareOptions(false);
  };

  const pollUrl = `${window.location.origin}/room/${poll.slug}`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(pollUrl);
    // Show toast notification
    console.log("Link copied to clipboard!");
    setShowShareOptions(false);
  };

  const handleDownloadQR = () => {
    try {
      const qrElement = qrRef.current;
      if (!qrElement) {
        alert("QR code not found");
        return;
      }

      // Find the SVG within the ref
      const svgElement = qrElement.querySelector("svg");
      if (!svgElement) {
        alert("QR code SVG not found");
        return;
      }

      // Clone the SVG to avoid modifying the original
      const svgClone = svgElement.cloneNode(true) as SVGElement;

      // Set explicit dimensions for better quality
      svgClone.setAttribute("width", "400");
      svgClone.setAttribute("height", "400");

      const svgData = new XMLSerializer().serializeToString(svgClone);
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      const img = new Image();

      canvas.width = 400;
      canvas.height = 400;

      img.onload = () => {
        if (ctx) {
          // White background
          ctx.fillStyle = "white";
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          // Draw QR code
          ctx.drawImage(img, 0, 0);
        }

        // Download
        canvas.toBlob((blob) => {
          if (blob) {
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `room-${poll.slug}-qr-code.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }
        }, "image/png");
      };

      const svgBlob = new Blob([svgData], {
        type: "image/svg+xml;charset=utf-8",
      });
      const svgUrl = URL.createObjectURL(svgBlob);
      img.src = svgUrl;

      setShowShareOptions(false);
    } catch (error) {
      console.error("Error downloading QR code:", error);
      alert("Failed to download QR code");
    }
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
              <span className="ml-2">{poll.id}</span>
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
              <div
                className="absolute right-0 mt-2 w-72 text-black bg-white rounded-lg shadow-lg z-10 p-4"
                onBlur={() => setShowShareOptions(!showShareOptions)}
                tabIndex={0}
              >
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
                      className="bg-purple-600 cursor-pointer text-white p-2 rounded-r-md hover:bg-purple-700"
                    >
                      <Copy size={16} />
                    </button>
                  </div>
                </div>

                <div className="mb-4">
                  <div className="text-sm text-gray-500 mb-2">Poll Code</div>
                  <div className="flex items-center space-x-3">
                    <div className="text-xl font-bold tracking-wide">
                      {poll.slug}
                    </div>
                    <button
                      onClick={() => navigator.clipboard.writeText(poll.slug)}
                      className="p-1 cursor-pointer hover:bg-gray-100 rounded"
                    >
                      <Copy size={16} className="text-gray-600" />
                    </button>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center p-4 border border-gray-200 rounded-lg">
                  <div
                    className="mb-3 w-32 h-32 bg-white flex items-center justify-center"
                    ref={qrRef}
                  >
                    <QRCodeComponent value={pollUrl} size={128} qrRef={qrRef} />
                    <span className="sr-only">QR Code</span>
                  </div>
                  <button
                    onClick={handleDownloadQR}
                    className="flex items-center cursor-pointer text-sm text-purple-600 hover:text-purple-800"
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
                ? "bg-red-700 text-white hover:bg-red-800"
                : "bg-green-700 text-white hover:bg-green-800"
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
