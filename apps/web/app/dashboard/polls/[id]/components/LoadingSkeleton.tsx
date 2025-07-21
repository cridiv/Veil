"use client";
import React from "react";

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-6 animate-pulse">
      {/* Header Skeleton */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-200"></div>
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-32 bg-gray-200 rounded"></div>
            </div>
          </div>
          <div className="flex space-x-3 w-full sm:w-auto">
            <div className="h-10 w-28 bg-gray-200 rounded"></div>
            <div className="h-10 w-36 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <div className="h-6 w-32 bg-gray-200 rounded"></div>
              <div className="h-10 w-32 bg-gray-200 rounded"></div>
            </div>

            {/* Question Items Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="border rounded-lg mb-4 p-4">
                <div className="flex items-start">
                  <div className="w-6 h-6 bg-gray-200 rounded-full mr-3"></div>
                  <div className="w-8 h-8 bg-gray-200 rounded-full mr-3"></div>
                  <div className="flex-1">
                    <div className="h-5 w-3/4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-4 w-1/4 bg-gray-200 rounded mb-4"></div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                      {[1, 2, 3, 4].map((j) => (
                        <div key={j} className="h-8 bg-gray-200 rounded"></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="h-6 w-32 bg-gray-200 rounded mb-6"></div>

            {/* Stats Skeleton */}
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex items-start mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <div className="h-4 w-24 bg-gray-200 rounded mb-2"></div>
                  <div className="h-5 w-16 bg-gray-200 rounded"></div>
                </div>
              </div>
            ))}

            <div className="mt-6">
              <div className="h-6 w-40 bg-gray-200 rounded mb-4"></div>

              <div className="space-y-4">
                <div>
                  <div className="flex justify-between mb-1">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
                </div>

                <div>
                  <div className="flex justify-between mb-1">
                    <div className="h-4 w-24 bg-gray-200 rounded"></div>
                    <div className="h-4 w-8 bg-gray-200 rounded"></div>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5"></div>
                </div>
              </div>

              <div className="mt-6 py-8 bg-gray-100 rounded-lg">
                <div className="h-12 w-12 bg-gray-200 rounded-full mx-auto mb-3"></div>
                <div className="h-4 w-48 bg-gray-200 rounded mx-auto"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
