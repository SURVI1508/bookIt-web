"use client";
import React, { useEffect, useState } from "react";
import ExperienceCard from "../Helpers/ExperienceCard";
import axios from "axios";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

// ====== Define interfaces ======
interface Location {
  city?: string;
  state?: string;
  country?: string;
}

interface Image {
  url: string;
  public_id?: string;
  _id?: string;
}

interface Price {
  basePrice: number;
  discountPrice?: number;
  currency?: string;
}

interface Product {
  _id: string;
  title: string;
  shortDescription?: string;
  slug?: string;
  images?: Image[];
  location?: Location;
  price?: Price;
}

const ExperienceListingSection: React.FC = () => {
  const [activityList, setActivityList] = useState<Product[]>([]);

  const getActivityList = async (): Promise<void> => {
    try {
      const response = await axios.get<{ products: Product[] }>(
        `${BASE_URL}/api/experiences`
      );
      setActivityList(response.data.products || []);
    } catch (error) {
      console.error("Failed to fetch experiences:", error);
    }
  };

  useEffect(() => {
    getActivityList();
  }, []);

  return (
    <section className="w-full">
      <div className="w-full container py-12">
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {activityList.map((activity) => {
            const { _id, title, shortDescription, images, location, price } =
              activity;

            return (
              <ExperienceCard
                key={_id}
                image={images?.[0]?.url ?? ""}
                title={title ?? "Untitled"}
                location={location?.city ?? location?.state ?? "Unknown"}
                description={shortDescription ?? ""}
                price={price?.basePrice ?? 0}
                route={`/experiences/${_id}`}
                onViewDetails={() => alert("View details clicked!")}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default ExperienceListingSection;
