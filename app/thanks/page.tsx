import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import AppLayout from "@/components/Layouts/AppLayout";

export default function BookingConfirmed() {
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
        {/* Success Icon */}
        <FaCheckCircle className="text-green-500 text-6xl mb-6 animate-pulse" />

        {/* Title */}
        <h1 className="text-2xl font-semibold text-gray-900">
          Booking Confirmed
        </h1>

        {/* Reference ID */}
        <p className="text-gray-500 mt-2">Ref ID: HUF56&SO</p>

        {/* Back Button */}
        <Link
          href="/"
          className="mt-6 bg-gray-200 hover:bg-gray-300 text-gray-800 px-5 py-2 rounded-md transition"
        >
          Back to Home
        </Link>
      </div>
    </AppLayout>
  );
}
