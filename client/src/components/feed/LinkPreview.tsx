import React from "react";

interface LinkPreviewProps {
  url: string;
  title: string;
  description: string;
  image: string;
  domain: string;
}

export default function LinkPreview({ url, title, description, image, domain }: LinkPreviewProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      className="mt-3 block border border-card-border rounded-2xl overflow-hidden hover:bg-foreground/[0.04] transition-colors"
    >
      {image && (
        <img
          src={image}
          alt={title}
          loading="lazy"
          className="w-full h-[150px] object-cover"
        />
      )}
      <div className="p-3">
        <p className="text-[13px] text-foreground-secondary leading-4">{domain}</p>
        <p className="text-[15px] text-foreground leading-5 mt-0.5">{title}</p>
        <p className="text-[13px] text-foreground-secondary leading-4 mt-0.5 line-clamp-2">{description}</p>
      </div>
    </a>
  );
}
