import React from 'react';
import { motion } from 'framer-motion';

/**
 * Reusable Skeleton component with shimmer animation.
 */
export const Skeleton = ({ className, width, height, variant = 'rectangular' }) => {
  const baseClass = "relative overflow-hidden bg-white/5";
  const variantClass = variant === 'circular' ? 'rounded-full' : 'rounded-2xl';
  
  return (
    <div 
      className={`${baseClass} ${variantClass} ${className}`}
      style={{ width, height }}
    >
      {/* Shimmer Effect */}
      <motion.div
        initial={{ x: '-100%' }}
        animate={{ x: '100%' }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.5, 
          ease: "linear" 
        }}
        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
      />
    </div>
  );
};

export const SkeletonText = ({ lines = 1, className }) => {
  return (
    <div className={`flex flex-col gap-3 ${className}`}>
      {[...Array(lines)].map((_, i) => (
        <Skeleton 
          key={i} 
          height={i === 0 ? "2rem" : "1rem"} 
          width={i === 0 ? "60%" : "90%"} 
          className={i === 0 ? "mb-2" : ""}
        />
      ))}
    </div>
  );
};

export const SkeletonHero = () => {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center px-6 relative overflow-hidden">
      {/* Circle Profile Skeleton */}
      <Skeleton variant="circular" width="min(60vw, 450px)" height="min(60vw, 450px)" className="mb-12 border-4 border-white/5" />
      
      {/* Title & Stats Skeleton */}
      <div className="flex flex-col items-center gap-6 w-full max-w-xl">
        <Skeleton width="80%" height="4rem" className="rounded-xl" />
        <div className="flex gap-4">
          <Skeleton width="100px" height="1.5rem" />
          <Skeleton width="100px" height="1.5rem" />
        </div>
        <Skeleton width="200px" height="3.5rem" className="rounded-full mt-4" />
      </div>
    </div>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="flex flex-col gap-4">
      <Skeleton height="350px" className="w-full rounded-3xl" />
      <Skeleton width="70%" height="1.5rem" />
      <Skeleton width="40%" height="1rem" />
    </div>
  );
};

export const SkeletonGrid = ({ count = 5 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 w-full px-6 md:px-12 py-12">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};

export default Skeleton;
