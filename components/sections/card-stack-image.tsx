"use client";

import Image from "next/image";

const SUPABASE_PUBLIC_RE =
  /supabase\.co\/storage\/v1\/object\/public\//i;

type CardStackImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

export function CardStackImage({ src, alt, priority }: CardStackImageProps) {
  if (SUPABASE_PUBLIC_RE.test(src)) {
    return (
      <Image
        src={src}
        alt={alt}
        fill
        priority={priority}
        className="portfolio-stack-visual-photo object-cover"
        sizes="(max-width: 768px) 90vw, 420px"
      />
    );
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element -- external CMS URLs
    <img src={src} alt={alt} className="portfolio-stack-visual-photo" loading="lazy" />
  );
}
