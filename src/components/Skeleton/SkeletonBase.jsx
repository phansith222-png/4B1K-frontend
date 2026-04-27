// components/Skeleton/SkeletonBase.jsx
export const SkeletonBlock = ({ className }) => (
    <div className={`bg-white/5 animate-pulse rounded-lg ${className}`} />
);

export const SkeletonCircle = ({ className }) => (
    <div className={`bg-white/5 animate-pulse rounded-full ${className}`} />
);