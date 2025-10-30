"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";

/**
 * Hook to toggle a query parameter in the URL
 * @returns {(key: string, value: string) => void}
 */
export const useToggleQueryParam = (): ((
  key: string,
  value: string
) => void) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  return (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // If param already exists and matches the value → remove it
    if (params.get(key) === value) {
      params.delete(key);
    } else {
      params.set(key, value);
    }

    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  };
};
