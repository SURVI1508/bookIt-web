"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import moment from "moment";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { GoPlus } from "react-icons/go";
import { HiMiniMinus } from "react-icons/hi2";
interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: { url: string; public_id: string; _id: string }[];
  category: string;
  duration: string;
  isActive: boolean;
  price: {
    basePrice: number;
    discountPrice: number;
    currency: string;
  };
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string[];
  };
  guide: {
    name: string;
    certified: boolean;
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    mapLink: string;
  };
  safetyInfo: string;
  gearIncluded: boolean;
  minAge: number;
  maxGroupSize: number;
  dates: {
    date: string;
    slots: {
      time: string;
      capacity: number;
      booked: number;
      status: string;
    }[];
  }[];
}
const ExperienceDetailsPage = ({ data }: { data: Product }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [maxQnt, setMaxQnt] = useState(10);
  const router = useRouter();
  const {
    title,
    description,
    images = [],
    dates = [],
    safetyInfo,
  } = data || {};
  const price = data?.price?.basePrice;
  const tax = 10;
  const total = price * quantity + tax; // matches example layout

  const handleDateSelect = (value: string) => {
    setSelectedTime("");
    setSelectedDate(value);
  };
  const availableSloats =
    dates?.find((item) => selectedDate == item?.date)?.slots || [];

  useEffect(() => {
    dates?.length > 0 && setSelectedDate(dates[0]?.date);
    return () => {};
  }, [dates]);

  return (
    <main className="w-full py-12">
      <div className="container space-y-5">
        <button
          onClick={() => router.back()}
          className="text-base hover:gap-2 transition-all duration-100 text-dark-15 inline-flex gap-3 items-center "
        >
          <FaArrowLeftLong />
          Details
        </button>
        <div className="bg-white flex flex-col md:flex-row gap-5">
          {/* Left Content */}
          <div className="flex-1 space-y-6">
            <div className="relative w-full aspect-video bg-grey-90  rounded-xl overflow-hidden">
              <Image
                src={images[0]?.url}
                alt={title}
                height={500}
                width={300}
                className="w-full"
              />
            </div>

            <div>
              <h1 className="text-2xl font-semibold text-gray-900 mb-2">
                {title}
              </h1>
              <p className="text-gray-600">{description}</p>
            </div>

            {/* Choose Date */}
            <section>
              <h3 className="font-medium text-gray-900 mb-2">Choose date</h3>
              <div className="flex flex-wrap gap-2">
                {dates?.map(({ date }: { date: string }) => (
                  <button
                    key={date}
                    onClick={() => handleDateSelect(date)}
                    className={`px-4 py-2 rounded-md border text-sm ${
                      selectedDate === date
                        ? "bg-yellow-55 text-gray-900 border-yellow-55"
                        : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {moment(date).format("MMM DD")}
                  </button>
                ))}
              </div>
            </section>

            {/* Choose Time */}
            <section>
              <h3 className="font-medium text-gray-900 mb-2">Choose time</h3>
              <div className="flex flex-wrap gap-2">
                {availableSloats.map(
                  ({
                    time,
                    capacity,
                    booked,
                    status,
                  }: {
                    time: string;
                    capacity: number;
                    booked: number;
                    status: string;
                  }) => {
                    const left = capacity - booked;
                    return (
                      <button
                        key={time}
                        onClick={() => {
                          setSelectedTime(time);
                          setMaxQnt(left);
                        }}
                        disabled={left === 0}
                        className={`px-4 py-2 rounded-md border text-sm flex items-center gap-2 ${
                          left === 0
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : selectedTime === time
                            ? "bg-yellow-55 text-gray-900 border-yellow-55"
                            : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {time}
                        {left > 0 && (
                          <span className="text-red-500 text-xs font-medium">
                            {left} left
                          </span>
                        )}
                        {left === 0 && (
                          <span className="text-gray-500 text-xs">
                            Sold out
                          </span>
                        )}
                      </button>
                    );
                  }
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                All times are in IST (GMT +5:30)
              </p>
            </section>

            {/* About */}
            <section>
              <h3 className="font-medium text-gray-900 mb-2">Safety Info</h3>
              <div className="text-gray-600 text-sm bg-gray-100 rounded-md p-3">
                {safetyInfo}
              </div>
            </section>
          </div>

          {/* Right Sidebar */}
          <aside className="w-full md:w-80 bg-grey-95  rounded-2xl p-5 h-fit space-y-4">
            <div className="flex justify-between text-gray-700">
              <span>Starts at</span>
              <span className="font-medium text-gray-900">₹{price}</span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-700">Quantity</span>
              <div className="flex items-center gap-3">
                <button
                  disabled={quantity == 1}
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="border border-grey-80 aspect-square rounded p-1 text-sme font-medium text-dark-08 hover:bg-gray-100 disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <HiMiniMinus />
                </button>
                <span>{quantity}</span>
                <button
                  disabled={quantity == maxQnt}
                  onClick={() => setQuantity((q) => q + 1)}
                  className="border border-grey-80 aspect-square rounded p-1 text-sme font-medium text-dark-08 hover:bg-gray-100 disabled:opacity-45 disabled:cursor-not-allowed"
                >
                  <GoPlus />
                </button>
              </div>
            </div>

            <div className="flex justify-between text-gray-700">
              <span>Subtotal</span>
              <span>₹{price * quantity}</span>
            </div>

            <div className="flex justify-between text-gray-700 border-b border-grey-80 py-2">
              <span>Taxes</span>
              <span>₹{tax}</span>
            </div>

            <div className="flex justify-between text-gray-900 text-lg font-semibold">
              <span>Total</span>
              <span>₹{total}</span>
            </div>

            <Button
              onClick={() =>
                router.push(
                  `/checkout?quantity=${quantity}&date=${encodeURIComponent(
                    selectedDate
                  )}&time=${encodeURIComponent(selectedTime)}&id=${data?._id}`
                )
              }
              className="w-full"
              variant="primary"
              disabled={!selectedDate || !selectedTime}
            >
              Confirm
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default ExperienceDetailsPage;
