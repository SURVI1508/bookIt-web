"use client";
import Image from "next/image";
import Button from "../common/Button";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FormEvent } from "react";

const Header = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const router = useRouter();

  const handleSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSearchTerm("");
    router.push(`/?q=${searchTerm}`);
  };

  return (
    <header className="w-full bg-white shadow  py-4 ">
      <div className="container flex flex-col gap-3 md:gap-0 md:flex-row justify-between">
        <Link href="/">
          <Image
            src="/HDlogo.svg"
            alt="logo"
            height={55}
            width={100}
            className=""
          />
        </Link>
        <form
          onSubmit={(e) => handleSearch(e)}
          className="inline-flex gap-3 items-center"
        >
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="bg-grey-95 px-4 py-2 h-[42px] rounded-lg flex-1 md:w-[340px]"
            placeholder="Search experiences"
          />
          <Button
            type="submit"
            disabled={!searchTerm}
            className="w-fit h-[42px] rounded-lg"
            variant="primary"
          >
            Search
          </Button>
        </form>
      </div>
    </header>
  );
};

export default Header;
