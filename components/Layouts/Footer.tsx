import Image from "next/image";
import Link from "next/link";

const Footer = () => {
  return (
    <footer className="w-full p-4">
      <div className="container rounded-lg bg-grey-99 border border-gray-100">
        <div className="p-5 flex flex-col gap-3 md:flex-row justify-between items-center">
          <Link href="/">
            <Image
              src="/HDlogo.svg"
              alt="logo"
              height={55}
              width={100}
              className=""
            />
          </Link>
          <Link
            href="https://survi-dev.vercel.app"
            target="_blank"
            className="text-sm  text-dark-25 font-medium "
          >
            Crafted with ❤️ by <span className="text-rose-400"> Sourav </span>
          </Link>
          <p className="text-center text-xs font-light">
            © 2025 : BookIt . All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
