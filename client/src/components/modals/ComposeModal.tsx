import React, { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Globe } from "lucide-react";
import { useAppStore } from "../../store/useAppStore";
import ComposeBox from "../feed/ComposeBox";

export default function ComposeModal() {
  const { composeModalOpen, setComposeModalOpen } = useAppStore();

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") setComposeModalOpen(false);
    };
    if (composeModalOpen) {
      document.addEventListener("keydown", handleEsc);
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.removeEventListener("keydown", handleEsc);
      document.body.style.overflow = "";
    };
  }, [composeModalOpen, setComposeModalOpen]);

  return (
    <AnimatePresence>
      {composeModalOpen && (
        <div className="fixed inset-0 z-[100] flex items-start justify-center pt-[5vh]">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[rgba(91,112,131,0.4)]"
            onClick={() => setComposeModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative bg-black rounded-2xl w-full max-w-[600px] min-h-[260px] z-10 shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            <div className="flex items-center justify-between px-4 py-3">
              <button
                onClick={() => setComposeModalOpen(false)}
                className="p-1.5 -m-1.5 rounded-full hover:bg-[rgba(231,233,234,0.1)] transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
              <button className="text-x-accent font-bold text-[14px]">Rascunhos</button>
            </div>

            <ComposeBox
              onPost={() => setComposeModalOpen(false)}
              autoFocus
            />

            <div className="px-4 pb-3 ml-[52px]">
              <button className="flex items-center gap-1.5 text-x-accent text-[14px] font-bold p-1.5 -m-1.5 rounded-full hover:bg-[rgba(29,155,240,0.1)] transition-colors">
                <Globe className="w-4 h-4" />
                Todos podem responder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
