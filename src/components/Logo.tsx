import Image from "next/image";
import Link from "next/link";

interface LogoProps {
  href?: string;
  size?: "sm" | "md" | "lg";
}

const sizes = {
  sm: { width: 220, height: 48, className: "h-10 w-auto max-w-[200px]" },
  md: { width: 280, height: 60, className: "h-12 w-auto max-w-[260px]" },
  lg: { width: 360, height: 78, className: "h-16 w-auto max-w-[340px]" },
};

export default function Logo({ href, size = "md" }: LogoProps) {
  const { width, height, className } = sizes[size];

  const image = (
    <Image
      src="/logo.png"
      alt="Kuwait International Driving Permit & Carnet Club"
      width={width}
      height={height}
      className={className}
      priority
    />
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex transition-opacity hover:opacity-90">
        {image}
      </Link>
    );
  }

  return <div className="inline-flex">{image}</div>;
}
