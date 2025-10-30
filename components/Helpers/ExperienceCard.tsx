"use client";
import Image from "next/image";
import Link from "next/link";
import { FC } from "react";

interface ExperienceCardProps {
  image: string;
  title: string;
  location: string;
  description: string;
  price: number;
  route: string;
  onViewDetails?: () => void;
}

const ExperienceCard: FC<ExperienceCardProps> = ({
  image,
  title,
  location,
  description,
  price,
  route,
  onViewDetails,
}) => {
  return (
    <div className="max-w-sm w-full bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col border border-gray-100">
      {/* Image */}
      <div className="relative h-56 w-full">
        <Image
          src={image}
          alt={title}
          title={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 400px"
        />
      </div>

      {/* Content */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <span className="text-sm bg-gray-100 text-gray-700 px-3 py-1 rounded-md">
              {location}
            </span>
          </div>
          <p className="text-gray-600 text-sm leading-snug">{description}</p>
        </div>

        {/* Price & Button */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-900 font-medium text-base">
            From <span className="text-xl font-semibold">₹{price}</span>
          </p>
          <Link
            href={route}
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-medium px-4 py-2 rounded-md transition-colors"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
