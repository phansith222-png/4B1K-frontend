import { motion } from 'framer-motion';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    className="px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md"
    onClick={onClick}
  >
    {label}
  </motion.button>
);