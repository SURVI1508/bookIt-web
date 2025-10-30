"use client";
import { BiSearchAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";

interface NoResultsProps {
  query?: string;
  onClear?: () => void;
}

const NoResults: React.FC<NoResultsProps> = ({ query = "", onClear }) => {
  const router = useRouter();

  const handleClear = () => {
    if (onClear) {
      onClear();
    } else {
      router.push("/");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center">
      {/* Icon */}
      <BiSearchAlt className="text-gray-400 text-6xl mb-4" />

      {/* Heading */}
      <h2 className="text-xl font-semibold text-gray-800">
        No results found for <span className="text-blue-600">"{query}"</span>
      </h2>

      {/* Subtext */}
      <p className="text-gray-500 mt-2">
        Try adjusting your search or using different keywords.
      </p>

      {/* Clear Button */}
      <button
        onClick={handleClear}
        className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-700 px-5 py-2 rounded-md transition"
      >
        Clear Search
      </button>
    </div>
  );
};

export default NoResults;
