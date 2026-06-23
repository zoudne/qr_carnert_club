import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
  showBackground?: boolean;
}

const sizes = {
  sm: { width: 72, height: 32, className: "h-7 w-auto" },
  md: { width: 96, height: 42, className: "h-9 w-auto" },
  lg: { width: 140, height: 60, className: "h-14 w-auto" },
};

export default function Logo({
  href,
  size = "md",
  showBackground = true,
}: LogoProps) {
  const { width, height, className } = sizes[size];

  const image = (
    <div
      className={
        showBackground
          ? "inline-flex items-center justify-center rounded-xl bg-black px-4 py-2 shadow-md"
          : "inline-flex items-center justify-center"
      }
    >
      <Image
        src="/logo.png"
        alt="K Club T"
        width={width}
        height={height}
        className={className}
        priority
      />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="transition-opacity hover:opacity-90">
        {image}
      </Link>
    );
  }

  return image;
}
