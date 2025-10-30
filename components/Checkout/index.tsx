"use client";

import { errorToast } from "@/utils/toastMessage";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

interface CheckoutData {
  time?: string;
  date?: string;
  id?: string;
  quantity?: string;
}
interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription: string;
  images: { url: string; public_id: string; _id: string }[];
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

interface CheckoutPageProps {
  data: CheckoutData;
  product: Product;
}

interface BookingData {
  productId?: string;
  date?: string;
  time?: string;
  qty?: number | string;
  promoCode?: string;
  name?: string;
  email?: string;
}

interface PromoData {
  code?: string;
  discountValue?: number;
  discountType?: "fixed" | "percent";
}

const CheckoutPage: React.FC<CheckoutPageProps> = ({ data, product }) => {
  const [agree, setAgree] = useState(false);
  const [promoLoading, setPromoloading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [bookingData, setBookingData] = useState<BookingData>({});
  const [appliedPromo, setApliedPromo] = useState<PromoData>({});
  const { time, date, id, quantity } = data;
  const { title, price } = product || {};
  const router = useRouter();
  const tax = 10;
  const qty = Number(quantity) || 0;
  const base = price?.basePrice || 0;
  const subtotal = base * qty;
  const total = subtotal + tax;

  const validatePromo = async (newCode: string) => {
    setPromoloading(true);
    try {
      const response = await axios({
        method: "GET",
        url: `${BASE_URL}/api/promo-codes/validate`,
        params: {
          code: newCode,
        },
      });

      const { code, discountValue, discountType } = response?.data?.promo;
      setApliedPromo({ code, discountValue, discountType });
      setPromoloading(false);
    } catch (err) {
      setPromoloading(false);
      setApliedPromo({});
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: {
            data?: {
              error?: string;
            };
          };
        };

        const errorMessage =
          axiosError.response?.data?.error || "Something went wrong!";
        console.log(errorMessage);
        errorToast(errorMessage);
      } else {
        console.error("Unexpected error:", err);
        errorToast("Unexpected error occurred!");
      }
    }
  };
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setBookingData((prev) => ({ ...prev, [name]: value }));
  };

  const createBooking = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: `${BASE_URL}/api/bookings`,
        data: bookingData,
      });
      setLoading(false);
      router.replace("/thanks");
    } catch (err) {
      setLoading(false);
      if (err && typeof err === "object" && "response" in err) {
        const axiosError = err as {
          response?: {
            data?: {
              message?: string;
            };
          };
        };

        const errorMessage =
          axiosError.response?.data?.message || "Something went wrong!";
        errorToast(errorMessage);
      } else {
        setLoading(false);
        errorToast("Unexpected error occurred!");
      }
    }
  };

  const finalPrice = (
    basePrice: string | number,
    discountType?: "fixed" | "percent" | "",
    discountValue?: number
  ): number => {
    // Convert basePrice to number
    const price =
      typeof basePrice === "string" ? parseFloat(basePrice) : basePrice;

    // If no discount or invalid values, return base price
    if (!discountType || !discountValue || discountValue <= 0) {
      return price;
    }

    let final = price;

    if (discountType === "fixed") {
      final = price - discountValue;
    } else if (discountType === "percent") {
      final = price - (price * discountValue) / 100;
    }

    // Ensure price never goes below 0
    return final > 0 ? final : 0;
  };

  useEffect(() => {
    if (product?._id) {
      setBookingData((prev) => ({
        ...prev,
        productId: product._id,
        date,
        time,
        qty: quantity,
      }));
    }
  }, [product?._id, date, time, quantity]);

  return (
    <main className="w-full py-12">
      <div className="container">
        {/* Header */}
        <div className="flex items-center gap-2 text-gray-800 font-medium mb-6">
          <button className="border border-gray-300 rounded px-3 py-1 text-sm hover:bg-gray-100">
            ←
          </button>
          <span>Checkout</span>
        </div>

        {/* Main Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Form Section */}
          <div className="flex-1 h-fit bg-gray-50 rounded-xl p-6 space-y-4">
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={bookingData?.name}
                  name="name"
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={bookingData?.email}
                  name="email"
                  onChange={handleChange}
                  className="w-full rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
              </div>
            </div>

            {/* Promo Code */}
            <div>
              <label className="block text-sm text-gray-700 mb-1">
                Promo code
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Enter promo code"
                  value={bookingData?.promoCode}
                  onChange={(e) =>
                    setBookingData((prev) => ({
                      ...prev,
                      promoCode: e.target.value,
                    }))
                  }
                  className="flex-1 rounded-md border border-gray-300 bg-gray-100 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-gray-400"
                />
                <Button
                  disabled={!bookingData?.promoCode || promoLoading}
                  loading={promoLoading}
                  onClick={() => validatePromo(bookingData?.promoCode ?? "")}
                  className="bg-black text-white"
                >
                  Apply
                </Button>
              </div>
            </div>

            {/* Checkbox */}
            <div className="flex items-center gap-2 mt-3">
              <input
                id="terms"
                type="checkbox"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
                className="w-4 h-4 border-gray-400 rounded"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the terms and safety policy
              </label>
            </div>
          </div>

          {/* Right Summary Section */}
          <aside className="w-full lg:w-80 bg-gray-50 rounded-xl p-6 space-y-4 border border-gray-200">
            <div className="flex justify-between text-gray-700 text-sm">
              <span>Experience</span>
              <span className="font-medium">{title}</span>
            </div>

            <div className="flex justify-between text-gray-700 text-sm">
              <span>Date</span>
              <span>{moment(date)?.format("DD MMM YYYY")}</span>
            </div>

            <div className="flex justify-between text-gray-700 text-sm">
              <span>Time</span>
              <span>{time}</span>
            </div>

            <div className="flex justify-between text-gray-700 text-sm">
              <span>Qty</span>
              <span>{quantity}</span>
            </div>

            <div className="flex justify-between text-gray-700 text-sm">
              <span>Subtotal</span>
              <span>₹{subtotal}</span>
            </div>

            <div className="flex justify-between text-gray-700 text-sm border-b pb-2">
              <span>Taxes</span>
              <span>₹{tax}</span>
            </div>

            <div className="flex justify-between text-gray-900 text-lg font-semibold">
              <span>Total</span>
              <span>
                ₹
                {finalPrice(
                  total,
                  appliedPromo?.discountType,
                  appliedPromo?.discountValue
                )}
              </span>
            </div>

            <Button
              disabled={!agree || loading}
              loading={loading}
              onClick={() => createBooking()}
              variant="primary"
              className="w-full"
            >
              Pay and Confirm
            </Button>
          </aside>
        </div>
      </div>
    </main>
  );
};

export default CheckoutPage;
