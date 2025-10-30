import { FaCheckCircle } from "react-icons/fa";
import Link from "next/link";
import AppLayout from "@/components/Layouts/AppLayout";
interface PageProps {
  params: { slug: string };
  searchParams: {
    ref?: string;
  };
}
export default async function BookingConfirmed({ searchParams }: PageProps) {
  const { ref } = await searchParams;
  return (
    <AppLayout>
      <div className="flex flex-col items-center justify-center min-h-[80vh] bg-gray-50">
        <FaCheckCircle className="text-green-500 text-6xl mb-6 animate-pulse" />

        <h1 className="text-2xl font-semibold text-gray-900">
          Booking Confirmed
        </h1>

        <div className="text-center">
          <p className="text-gray-500 mt-2">Ref ID: {ref}</p>

          <p className="text-sm font-light text-gray-400">
            We have set the details to you
            <span className="text-dark-15 font-medium"> email </span>
            you can check.
          </p>
        </div>

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
