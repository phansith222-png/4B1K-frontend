import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import usePostStore from '../../stores/postStore';

export default function TrendingArtists({ onToggleArtist, selectedArtistIds }) {
  const posts = usePostStore(state => state.posts);

  const trendingArtists = useMemo(() => {
    if (!posts) return [];

    const countMap = {};
    posts.forEach(post => {
      post.postArtists?.forEach(pa => {
        const artist = pa.artist;
        if (artist) {
          if (!countMap[artist.id]) {
            countMap[artist.id] = {
              id: artist.id,
              name: artist.artistName,
              count: 0
            };
          }
          countMap[artist.id].count += 1;
        }
      });
    });

    return Object.values(countMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [posts]);

  return (
    <div className="">
      <div className="space-y-4">
        {trendingArtists.length > 0 ? (
          trendingArtists.map((artist, idx) => {
            const isSelected = selectedArtistIds.includes(artist.id);
            return (
              <div
                key={artist.id}
                onClick={() => onToggleArtist({ id: artist.id, artistName: artist.name })}
                className={`flex justify-between items-center group cursor-pointer p-4 rounded-2xl transition-all ${isSelected ? 'bg-white/10 border border-[#00E5FF]/30 shadow-[0_0_20px_rgba(0,229,255,0.1)]' : 'hover:bg-white/5'
                  }`}
              >
                <div className="flex items-center gap-4">
                  <span className={`font-black text-sm w-5 ${isSelected ? 'text-[#00E5FF]' : 'text-white/40'}`}>0{idx + 1}</span>
                  <span className={`transition-colors text-[15px] font-black ${isSelected ? 'text-[#00E5FF]' : 'text-white group-hover:text-[#00E5FF]'}`}>
                    {artist.name}
                  </span>
                </div>
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-full transition-all uppercase tracking-tighter ${isSelected ? 'bg-[#00E5FF] text-black shadow-[0_0_15px_rgba(0,229,255,0.4)]' : 'text-white/40 bg-white/5 group-hover:bg-[#00E5FF]/20 group-hover:text-[#00E5FF]'
                  }`}>
                  {artist.count} posts
                </span>
              </div>
            );
          })
        ) : (
          <p className="text-white/40 text-xs italic px-4">No data available</p>
        )}
      </div>
    </div>
  );
}

