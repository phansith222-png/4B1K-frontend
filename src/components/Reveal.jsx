import React from "react";
import { motion } from "framer-motion";

export default function Reveal({ children, delay = 0, effect = "fade-up" }) {
  const variants = {
    "fade-up": {
      hidden: { opacity: 0, y: 40, scale: 0.98, filter: "blur(10px)" },
      visible: { opacity: 1, y: 0, scale: 1, filter: "blur(0px)" }
    },
    "zoom-in": {
      hidden: { opacity: 0, scale: 0.9, filter: "blur(15px)" },
      visible: { opacity: 1, scale: 1, filter: "blur(0px)" }
    }
  };

  return (
    <motion.div
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-50px" }}
      variants={variants[effect]}
      transition={{ 
        duration: 1.1, 
        delay: delay, 
        ease: [0.16, 1, 0.3, 1] // จังหวะ Cinematic
      }}
      className="w-full"
    >
      {children}
    </motion.div>
  );
}