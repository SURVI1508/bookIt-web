import CheckoutPage from "@/components/Checkout";
import AppLayout from "@/components/Layouts/AppLayout";
import { redirect } from "next/navigation";

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ✅ Combine params + searchParams in one interface
interface PageProps {
  params: { slug: string };
  searchParams: {
    time?: string;
    date?: string;
    id?: string;
    quantity?: string;
  };
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

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/experiences/${slug}`, {
      cache: "no-store", // always fetch fresh data
    });

    if (!res.ok) return null;

    const { product }: { product: Product } = await res.json();
    return product;
  } catch {
    return null;
  }
}

const Page = async ({ searchParams }: PageProps) => {
  const { time, date, id, quantity } = await searchParams;

  // ✅ Safely handle undefined `id`
  const productData = id ? await getProduct(id) : null;

  if (!productData) return redirect("/");

  return (
    <AppLayout>
      <CheckoutPage product={productData} data={{ time, date, id, quantity }} />
    </AppLayout>
  );
};

export default Page;
