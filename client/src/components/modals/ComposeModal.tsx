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
            className="absolute inset-0 bg-ink/40"
            onClick={() => setComposeModalOpen(false)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative bg-card rounded-r-4 w-full max-w-[600px] min-h-[260px] z-10 shadow-elev-3 border border-line"
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-line">
              <button
                onClick={() => setComposeModalOpen(false)}
                className="p-1.5 -m-1.5 rounded-full hover:bg-paper-2 transition-colors text-ink-3"
                aria-label="Fechar"
              >
                <X className="w-5 h-5 stroke-[1.75]" />
              </button>
              <button
                className="text-ink text-[13px] font-semibold hover:text-floodlight transition-colors"
                title="Rascunhos (em breve)"
              >
                Rascunhos
              </button>
            </div>

            <ComposeBox onPost={() => setComposeModalOpen(false)} autoFocus />

            <div className="px-5 pb-4 ml-[64px]">
              <button
                className="inline-flex items-center gap-1.5 text-floodlight text-[13px] font-medium rounded-full hover:bg-floodlight/10 px-2 py-1 -ml-2 transition-colors"
                title="Privacidade (em breve)"
              >
                <Globe className="w-4 h-4 stroke-[1.75]" />
                Todos podem responder
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
