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
}

const ExperienceCard: FC<ExperienceCardProps> = ({
  image,
  title,
  location,
  description,
  price,
  route,
}) => {
  return (
    <div className=" w-full bg-white rounded-2xl overflow-hidden  transition-shadow duration-300 flex flex-col">
      {/* Image */}
      <div className="relative h-56 bg-gray-200 w-full">
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
      <div className="flex flex-col justify-between flex-1 bg-grey-95 p-4">
        <div>
          <div className="flex items-start justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
            <span className="text-sm bg-grey-90 text-gray-700 px-3 py-1 rounded-md">
              {location}
            </span>
          </div>
          <p className="text-grey-70 text-sm leading-snug">{description}</p>
        </div>

        {/* Price & Button */}
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-900  text-sm">
            From{" "}
            <span className="text-lg font-semibold">₹{price?.toFixed(2)}</span>
          </p>
          <Link
            href={route}
            className="bg-yellow-55 text-dark-10 px-3 py-2 rounded-md text-xs"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ExperienceCard;
