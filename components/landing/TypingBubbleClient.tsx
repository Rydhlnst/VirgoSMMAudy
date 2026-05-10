"use client";

import { motion } from "framer-motion";

export function TypingBubbleClient({ text }: { text?: string }) {
  const dotTransition = {
    duration: 0.55,
    repeat: Infinity,
    repeatType: "reverse" as const,
    ease: [0.42, 0, 0.58, 1] as const,
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -6, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease: [0, 0, 0.58, 1] as const }}
      className="inline-flex items-center gap-2 rounded-full bg-accent-foreground px-5 py-3 shadow-sm"
      aria-label={text ? `${text} (typing...)` : "Typing..."}
    >
      <span className="inline-flex items-center gap-1">
        {[0, 1, 2].map((i) => (
          <motion.span
            key={i}
            initial={{ y: 0, opacity: 0.4 }}
            animate={{ y: -1.5, opacity: 1 }}
            transition={{
              ...dotTransition,
              delay: i * 0.12,
            }}
            className="size-2.5 rounded-full bg-background"
          />
        ))}
      </span>
    </motion.div>
  );
}
