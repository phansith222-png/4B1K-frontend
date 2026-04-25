import { getArtistInfo } from './artistHelper';

const DEFAULT_IMG = 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop';

export const formatArtistsToSlides = (artists) => {
    return [...artists]
        .sort(() => 0.5 - Math.random())
        .slice(0, 6)
        .map(a => {
            const info = getArtistInfo(a);
            return {
                img: a.profileImage || DEFAULT_IMG,
                title: `${a.artistName}\nTop in ${info.label}`,
                desc: `View the latest from our ${info.label} collection.`,
                path: info.path,
                color: info.color,
                artistId: a.id,
                artistName: a.artistName,
            };
        });
};

export const formatTopEvents = (events) => {
    if (!events.length) return [];
    
    // Sort by date
    const sorted = [...events].sort((a, b) => new Date(a.startTime) - new Date(b.startTime));
    
    // Pad to 6
    let valid = sorted.slice(0, 6);
    while (valid.length > 0 && valid.length < 6) {
        valid = [...valid, ...valid].slice(0, 6);
    }
    return valid;
};