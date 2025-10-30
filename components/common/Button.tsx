import React from "react";
import Link from "next/link";
import { twMerge } from "tailwind-merge";
import type { IconType } from "react-icons";

const variantClasses = {
  default: "bg-gray-200 text-gray-500",
  primary: "bg-yellow-55 text-dark-08",
  success: "bg-success text-white",
  danger: "bg-danger text-white",
  border: "bg-dark-08 text-grey-60 border border-dark-15",
} as const;

type Variant = keyof typeof variantClasses;

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: Variant;
  bgColor?: string;
  textColor?: string;
  icon?: IconType;
  href?: string;
  height?: string;
  width?: string;
  rounded?: string;
  className?: string;
  iconClass?: string;
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  variant = "default",
  bgColor,
  textColor,
  icon: Icon,
  href,
  height = "h-10",
  width = "px-4",
  rounded = "rounded-[7px]",
  className,
  iconClass = "w-5 h-5",
  loading = false,
  ...props
}) => {
  const baseClasses =
    "inline-flex items-center text-sm justify-center gap-2  transition duration-200 focus:outline-none cursor-pointer disabled:cursor-not-allowed disabled:opacity-50";
  const variantClass = variantClasses[variant] || variantClasses.default;
  const customColors = `${bgColor ?? ""} ${textColor ?? ""}`;
  const classes = twMerge(
    baseClasses,
    variantClass,
    height,
    width,
    rounded,
    customColors,
    className
  );

  // If href is passed, render a Next.js Link
  if (href) {
    return (
      <Link href={href} className={classes} {...(props as any)}>
        {children}
        {Icon && <Icon className={iconClass} />}
      </Link>
    );
  }

  // Normal button
  return (
    <button {...props} className={classes} disabled={loading || props.disabled}>
      {children}
      {Icon && <Icon className={iconClass} />}
    </button>
  );
};

export default Button;
