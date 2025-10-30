"use client";
import { useEffect, useState } from "react";
import ExperienceCard from "../Helpers/ExperienceCard";
import axios from "axios";
import NoResults from "../Helpers/NoResults";
import Button from "../common/Button";
import ExperienceCardSkeleton from "../Helpers/ExperienceCardSkeleton";
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

const ExperienceListingSection = ({ query }: { query?: string }) => {
  const [activityList, setActivityList] = useState<Product[]>([]);
  const [dataLoading, setDataLoading] = useState(true);
  const getActivityList = async (query?: string): Promise<void> => {
    try {
      const response = await axios.get<{ products: Product[] }>(
        `${BASE_URL}/api/experiences`,
        { params: { title: query ?? null } }
      );
      setActivityList(response.data.products || []);
      setDataLoading(false);
    } catch (error) {
      setActivityList([]);
      setDataLoading(false);
    }
  };

  useEffect(() => {
    getActivityList(query);
  }, [query]);

  return (
    <section className="w-full">
      <div className="w-full space-y-5 container py-12">
        {!dataLoading && query && activityList?.length > 0 && (
          <div className="w-full flex flex-row justify-between ">
            <h2 className="font-bold text-dark-15 text-lg md:text-xl">
              {activityList?.length} Result found for{" "}
              <span className="text-yellow-55">&apos;{query}&apos;</span>
            </h2>

            <Button
              href="/"
              value="border"
              className="text-xs bg-black text-white"
            >
              Clear search
            </Button>
          </div>
        )}

        {/* no data  */}
        {!dataLoading && activityList?.length < 1 && (
          <NoResults query={query} />
        )}

        {/* loading  */}

        {dataLoading && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 10 }).map((_, index) => (
              <ExperienceCardSkeleton key={index} />
            ))}
          </div>
        )}
        {/* if data  */}
        {!dataLoading && activityList?.length > 0 && (
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {activityList?.map((activity) => {
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
        )}
      </div>
    </section>
  );
};

export default ExperienceListingSection;
