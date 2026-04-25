/**
 * Common Framer Motion animation variants.
 * @module animations
 */

/**
 * Fade in and move up animation variant.
 * @type {import('framer-motion').Variants}
 */
export const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.4 }
};
