import { SkeletonBlock, SkeletonCircle } from './SkeletonBase';

const ArtistPageSkeleton = () => {
    return (
        <div className="bg-[#1c172e] min-h-screen p-8 space-y-12 overflow-hidden">
            {/* Hero Section Skeleton */}
            <div className="flex flex-col md:flex-row gap-8 items-center md:items-end">
                <SkeletonBlock className="w-64 h-64 md:w-80 md:h-80 rounded-2xl" />
                <div className="flex-1 space-y-4 w-full">
                    <SkeletonBlock className="h-6 w-32" />
                    <SkeletonBlock className="h-16 w-3/4" />
                    <div className="flex gap-4">
                        <SkeletonCircle className="w-12 h-12" />
                        <SkeletonCircle className="w-12 h-12" />
                    </div>
                </div>
            </div>

            {/* Music Player Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <SkeletonBlock className="h-10 w-48" />
                    {[1, 2, 3, 4, 5].map((i) => (
                        <SkeletonBlock key={i} className="h-16 w-full" />
                    ))}
                </div>
                <div className="space-y-4">
                    <SkeletonBlock className="h-10 w-32" />
                    <SkeletonBlock className="h-64 w-full" />
                </div>
            </div>
        </div>
    );
};

export default ArtistPageSkeleton;