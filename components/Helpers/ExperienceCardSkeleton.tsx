"use client";
import { FC } from "react";

const ExperienceCardSkeleton: FC = () => {
  return (
    <div className="max-w-sm w-full bg-white rounded-xl overflow-hidden border border-gray-50 animate-pulse flex flex-col">
      {/* Image Skeleton */}
      <div className="relative h-56 w-full bg-gray-200" />

      {/* Content Skeleton */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          {/* Title & Location */}
          <div className="flex items-start justify-between mb-2">
            <div className="h-5 w-2/3 bg-gray-200 rounded-md" />
            <div className="h-5 w-16 bg-gray-200 rounded-md" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-3 w-full bg-gray-200 rounded-md" />
            <div className="h-3 w-5/6 bg-gray-200 rounded-md" />
            <div className="h-3 w-2/3 bg-gray-200 rounded-md" />
          </div>
        </div>

        {/* Price & Button */}
        <div className="mt-4 flex items-center justify-between">
          <div className="h-6 w-24 bg-gray-200 rounded-md" />
          <div className="h-9 w-28 bg-gray-300 rounded-md" />
        </div>
      </div>
    </div>
  );
};

export default ExperienceCardSkeleton;
