"use client";

import { errorToast, successToast } from "@/utils/toastMessage";
import axios from "axios";
import moment from "moment";
import { useEffect, useState } from "react";
import Button from "../common/Button";
import { useRouter } from "next/navigation";
import { FaArrowLeftLong } from "react-icons/fa6";
import { useForm } from "@/hooks/useForm";
import { bookingSchema } from "@/validation/bookingSchema";
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
  const [appliedPromo, setApliedPromo] = useState<PromoData>({});
  const {
    formData,
    setFormData,
    handleChange,
    handleSubmit,
    errors,
    setErrors,
    reset,
  } = useForm<BookingData>({
    defaultValues: {
      productId: "",
      date: "",
      time: "",
      qty: 1,
      promoCode: "",
      name: "",
      email: "",
    },
    schema: bookingSchema,
  });

  const { time, date, id, quantity } = data;
  const { title, price } = product || {};
  const router = useRouter();
  const tax = 10;
  const qty = Number(quantity) || 0;
  const base = price?.basePrice || 0;
  const subtotal = base * qty;

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
      successToast("Coupon applied ");
    } catch (err) {
      setPromoloading(false);
      setApliedPromo({});
      handleChange("promoCode", "");
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
        errorToast(errorMessage);
      } else {
        errorToast("Unexpected error occurred!");
      }
    }
  };

  const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    handleChange(name as keyof BookingData, value);
  };

  const onSubmit = async () => {
    setLoading(true);
    try {
      const response = await axios({
        method: "POST",
        url: `${BASE_URL}/api/bookings`,
        data: formData,
      });
      setLoading(false);
      const { booking, referenceNumber } = response?.data?.data;
      router.replace(`/thanks?ref=${referenceNumber}`);
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
    const price = Number(basePrice);

    // If no discount or invalid values, return base price
    if (!discountType || !discountValue || discountValue <= 0) {
      return price;
    }

    let final = price;

    if (discountType === "fixed") {
      final = price - discountValue;
    } else if (discountType === "percent") {
      const discountAmount = (price * discountValue) / 100;
      final = price - Math.min(discountAmount, price); // cap discount at subtotal
    }

    // Ensure final price never goes below 0
    return final > 0 ? final : 0;
  };

  const totalPayable =
    finalPrice(
      subtotal,
      appliedPromo?.discountType,
      appliedPromo?.discountValue
    ) + tax;

  useEffect(() => {
    if (product?._id) {
      setFormData((prev) => ({
        ...prev,
        productId: product._id,
        date,
        time,
        qty: quantity,
      }));
    }
  }, [product?._id, date, time, quantity]);

  return (
    <main className="w-full min-h-screen py-12">
      <div className="container space-y-5">
        <button
          onClick={() => router.back()}
          className="text-base hover:gap-2 transition-all duration-100 text-dark-15  inline-flex gap-3 items-center "
        >
          <FaArrowLeftLong />
          Checkout
        </button>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Form Section */}
          <div className="flex-1 h-fit sm:bg-gray-50 sm:rounded-xl sm:p-6 space-y-4">
            {/* Name + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Full name
                </label>
                <input
                  type="text"
                  placeholder="Your name"
                  value={formData?.name || ""}
                  name="name"
                  onChange={onChange}
                  className="w-full rounded-sm  bg-grey-90 p-3 text-sm"
                />
                {errors?.name && (
                  <span className="text-xs text-red-500">{errors?.name}</span>
                )}
              </div>
              <div>
                <label className="block text-sm text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  placeholder="Your email"
                  value={formData?.email || ""}
                  name="email"
                  onChange={onChange}
                  className="w-full rounded-sm  bg-grey-90 p-3 text-sm"
                />
                {errors?.email && (
                  <span className="text-xs text-red-500">{errors?.email}</span>
                )}
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
                  value={formData?.promoCode || ""}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      promoCode: e.target.value,
                    }))
                  }
                  className="w-full flex-1 rounded-sm h-10 bg-grey-90 p-3 text-sm"
                />
                <Button
                  disabled={!formData?.promoCode || promoLoading}
                  loading={promoLoading}
                  onClick={() => validatePromo(formData?.promoCode ?? "")}
                  className="bg-black text-white h-10 px-3 w-28 py-0"
                >
                  Apply
                </Button>
              </div>
              {errors?.promoCode && (
                <span className="text-xs text-red-500">
                  {errors?.promoCode}
                </span>
              )}
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
          <aside className="w-full lg:w-80 bg-grey-95  rounded-2xl p-5 space-y-4 ">
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

            <div className="flex justify-between text-gray-700 text-sm border-b border-grey-80 pb-2">
              <span>Taxes</span>
              <span>₹{tax}</span>
            </div>

            <div className="flex justify-between text-gray-900 text-lg font-semibold">
              <span>Total</span>
              <span>₹{totalPayable?.toFixed(2)}</span>
            </div>

            <Button
              disabled={!agree || loading}
              loading={loading}
              onClick={handleSubmit(() => onSubmit())}
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
