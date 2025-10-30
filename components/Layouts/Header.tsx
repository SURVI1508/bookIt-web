import Image from "next/image";
import React from "react";
import Button from "../common/Button";
import Link from "next/link";

const Header = () => {
  return (
    <header className="w-full bg-white shadow  py-4 ">
      <div className="container flex flex-row justify-between">
        <Link href="/">
          <Image
            src="/HDlogo.svg"
            alt="logo"
            height={55}
            width={100}
            className=""
          />
        </Link>
        <div className="inline-flex gap-3 items-center">
          <input
            className="bg-grey-95 px-4 py-2 h-[42px] rounded-lg w-[340px]"
            placeholder="Search experiences"
          />
          <Button className="w-fit h-[42px] rounded-lg" variant="primary">
            Search
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;
