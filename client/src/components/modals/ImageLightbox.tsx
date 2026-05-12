import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, Download } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";

export default function ImageLightbox() {
  const { imageModalOpen, imageModalImages, imageModalIndex, closeImageModal, openImageModal } = useAppStore();

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (!imageModalOpen) return;
      if (e.key === "Escape") closeImageModal();
      if (e.key === "ArrowLeft" && imageModalIndex > 0) {
        openImageModal(imageModalImages, imageModalIndex - 1);
      }
      if (e.key === "ArrowRight" && imageModalIndex < imageModalImages.length - 1) {
        openImageModal(imageModalImages, imageModalIndex + 1);
      }
    };
    document.addEventListener("keydown", handleKey);
    if (imageModalOpen) document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [imageModalOpen, imageModalIndex, imageModalImages, closeImageModal, openImageModal]);

  return (
    <AnimatePresence>
      {imageModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] bg-black/90 flex items-center justify-center"
          onClick={closeImageModal}
        >
          <button
            onClick={closeImageModal}
            className="absolute top-4 left-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <button
            className="absolute top-4 right-4 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
            aria-label="Download"
          >
            <Download className="w-5 h-5" />
          </button>

          {imageModalImages.length > 1 && imageModalIndex > 0 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openImageModal(imageModalImages, imageModalIndex - 1);
              }}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
              aria-label="Previous"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
          )}

          {imageModalImages.length > 1 && imageModalIndex < imageModalImages.length - 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                openImageModal(imageModalImages, imageModalIndex + 1);
              }}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/70 transition-colors z-10"
              aria-label="Next"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          )}

          <motion.img
            key={imageModalIndex}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            src={imageModalImages[imageModalIndex]}
            alt="Full size"
            className="max-w-[90vw] max-h-[90vh] object-contain"
            onClick={(e) => e.stopPropagation()}
          />

          {imageModalImages.length > 1 && (
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
              {imageModalImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); openImageModal(imageModalImages, i); }}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    i === imageModalIndex ? "bg-white" : "bg-white/40"
                  }`}
                  aria-label={`Image ${i + 1}`}
                />
              ))}
            </div>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
