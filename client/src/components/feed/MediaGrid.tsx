import React from "react";
import { useAppStore } from "../../store/useAppStore";

interface MediaGridProps {
  images: string[];
}

const MediaGrid = React.memo(function MediaGrid({ images }: MediaGridProps) {
  const openImageModal = useAppStore((s) => s.openImageModal);

  if (images.length === 0) return null;

  const handleClick = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    openImageModal(images, index);
  };

  if (images.length === 1) {
    return (
      <div className="mt-3 rounded-2xl overflow-hidden">
        <img
          src={images[0]}
          alt="Post media"
          loading="lazy"
          onClick={(e) => handleClick(0, e)}
          className="w-full max-h-[400px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
        />
      </div>
    );
  }

  if (images.length === 2) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
        {images.map((img, i) => (
          <img
            key={i}
            src={img}
            alt={`Post media ${i + 1}`}
            loading="lazy"
            onClick={(e) => handleClick(i, e)}
            className="w-full h-[286px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
          />
        ))}
      </div>
    );
  }

  if (images.length === 3) {
    return (
      <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden h-[286px]">
        <img
          src={images[0]}
          alt="Post media 1"
          loading="lazy"
          onClick={(e) => handleClick(0, e)}
          className="w-full h-full object-cover cursor-pointer hover:opacity-95 transition-opacity row-span-2"
        />
        <div className="flex flex-col gap-0.5">
          {images.slice(1).map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Post media ${i + 2}`}
              loading="lazy"
              onClick={(e) => handleClick(i + 1, e)}
              className="w-full h-[143px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-2 gap-0.5 rounded-2xl overflow-hidden">
      {images.slice(0, 4).map((img, i) => (
        <img
          key={i}
          src={img}
          alt={`Post media ${i + 1}`}
          loading="lazy"
          onClick={(e) => handleClick(i, e)}
          className="w-full h-[143px] object-cover cursor-pointer hover:opacity-95 transition-opacity"
        />
      ))}
    </div>
  );
});

export default MediaGrid;
