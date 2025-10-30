import AppLayout from "@/components/Layouts/AppLayout";
import ExperienceDetailsPage from "@/components/SingleExperience";
import { Metadata } from "next";
import { redirect } from "next/navigation";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

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

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await fetch(`${BASE_URL}/api/experiences/${slug}`, {
      next: { revalidate: 120 }, // Revalidate every 2 minutes
    });

    if (!res.ok) throw new Error("Failed to fetch experience data");

    const { product }: { product: Product } = await res.json();

    return {
      title: product.seo.metaTitle || product.title,
      description: product.seo.metaDescription || product.shortDescription,
      keywords: product.seo.keywords,
      openGraph: {
        title: product.seo.metaTitle,
        description: product.seo.metaDescription,
        images: product.images?.length
          ? [{ url: product.images[0].url }]
          : undefined,
      },
      alternates: {
        canonical: `/experiences/${slug}`,
      },
    };
  } catch {
    return {
      title: "Experience Not Found",
      description: "Sorry, we couldn’t load the experience details.",
    };
  }
}

async function getProduct(slug: string): Promise<Product | null> {
  try {
    const res = await fetch(`${BASE_URL}/api/experiences/${slug}`, {
      cache: "no-store", // always fetch fresh data
    });

    if (!res.ok) return null;

    const { product }: { product: Product } = await res.json();
    return product;
  } catch (err) {
    console.error("Error fetching product:", err);
    return null;
  }
}
const ExperiencesPage = async ({ params }: PageProps) => {
  const { slug } = await params;
  const product = await getProduct(slug);

  if (!product) {
    redirect("/");
  }

  return (
    <AppLayout>
      <ExperienceDetailsPage data={product} />
    </AppLayout>
  );
};

export default ExperiencesPage;
