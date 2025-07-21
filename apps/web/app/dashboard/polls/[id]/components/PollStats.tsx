"use client";
import React from "react";
import { Clock, Users, BarChart2, Calendar } from "lucide-react";
import { Poll } from "../../../../types/poll";

interface PollStatsProps {
  poll: Poll;
}

const PollStats: React.FC<PollStatsProps> = ({ poll }) => {
  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "past":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl text-black font-semibold mb-4">Poll Stats</h2>

      <div className="grid grid-cols-1 gap-4">
        <div className="flex items-start">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-purple-100 mr-3">
            <Calendar className="h-5 w-5 text-purple-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Poll Duration</div>
            <div className="font-medium text-black">
              {formatDate(poll.startDate)} - {formatDate(poll.endDate)}
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100 mr-3">
            <Clock className="h-5 w-5 text-blue-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Status</div>
            <div>
              <span
                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                  poll.status
                )}`}
              >
                {poll.status.charAt(0).toUpperCase() + poll.status.slice(1)}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-start">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-green-100 mr-3">
            <Users className="h-5 w-5 text-green-600" />
          </div>
          <div>
            <div className="text-sm text-gray-500 mb-1">Responses</div>
            <div className="font-medium text-black">{poll.responses}</div>
          </div>
        </div>

        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3 text-black">
            Live Participation
          </h3>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Active Users</span>
                <span className="font-medium text-black">0</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div className="bg-purple-600 h-2.5 rounded-full w-0"></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Response Rate</span>
                <span className="font-medium text-black">0%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                <div className="bg-green-500 h-2.5 rounded-full w-0"></div>
              </div>
            </div>
          </div>

          <div className="mt-6 text-center py-6 bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <BarChart2 className="h-8 w-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500">
              Start a live session to see real-time analytics
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PollStats;
