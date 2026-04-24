import React, { useMemo } from 'react';
import { Flame } from 'lucide-react';
import usePostStore from '../../stores/postStore';

export default function TrendingArtists({ onSelectArtist, selectedArtistId }) {
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
    <div className="bg-white/[0.03] border border-white/10 rounded-3xl p-6 backdrop-blur-xl">
      <h3 className="text-[#00F5D4] text-xs font-black tracking-widest mb-6 uppercase flex items-center gap-2">
        <Flame size={16} /> Trending Artists
      </h3>
      <div className="space-y-5">
        {trendingArtists.length > 0 ? (
          trendingArtists.map((artist, idx) => (
            <div 
              key={artist.id} 
              onClick={() => onSelectArtist(artist.id)}
              className={`flex justify-between items-center group cursor-pointer p-2 rounded-xl transition-all ${
                selectedArtistId === artist.id ? 'bg-[#00F5D4]/10 border border-[#00F5D4]/20' : 'hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className={`font-black text-xs w-4 ${selectedArtistId === artist.id ? 'text-[#00F5D4]' : 'text-gray-500'}`}>0{idx + 1}</span>
                <span className={`transition-colors font-bold ${selectedArtistId === artist.id ? 'text-white' : 'text-gray-200 group-hover:text-[#00F5D4]'}`}>
                  {artist.name}
                </span>
              </div>
              <span className={`text-[10px] px-3 py-1 rounded-full transition-all ${
                selectedArtistId === artist.id ? 'bg-[#00F5D4] text-black' : 'text-gray-500 bg-white/5 group-hover:bg-[#00F5D4]/10 group-hover:text-[#00F5D4]'
              }`}>
                {artist.count} mentions
              </span>
            </div>
          ))
        ) : (
          <p className="text-gray-600 text-xs italic">No data available</p>
        )}
      </div>
    </div>
  );
}

