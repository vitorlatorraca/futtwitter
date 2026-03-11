import React, { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useAppStore } from "../../store/useAppStore";

export default function Toast() {
  const { toastMessage, hideToast } = useAppStore();

  useEffect(() => {
    if (toastMessage) {
      const timer = setTimeout(hideToast, 3000);
      return () => clearTimeout(timer);
    }
  }, [toastMessage, hideToast]);

  return (
    <AnimatePresence>
      {toastMessage && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-[60px] left-1/2 -translate-x-1/2 z-[300] bg-x-accent text-white text-[15px] font-medium px-4 py-3 rounded-lg shadow-lg"
        >
          {toastMessage}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
