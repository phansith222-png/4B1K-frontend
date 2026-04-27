import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const usePlayerStore = create(
    persist(
        (set, get) => ({
            // Core Data
            artist: null,
            songs: [],
            queue: [],
            currentSongIndex: 0,
            
            // UI State
            isPlaying: false,
            isMinimized: false,
            isPlayerReady: false,
            _hasHydrated: false,
            
            // Player Sync Data
            progress: 0,
            currentTime: '0:00',
            duration: '0:00',
            volume: 80,
            
            // Actions
            setArtist: (artist) => set({ artist }),
            setSongs: (songs) => set({ songs }),
            setQueue: (queue) => set({ queue }),

            // Fetch default songs from backend for initial state
            fetchDefaultSongs: async () => {
                const { getAllArtists, getArtistById } = await import('../api/artist');
                
                try {
                    const res = await getAllArtists();
                    const artists = res?.artists || res?.data || res || [];
                    if (artists.length > 0) {
                        // Pick 3 random artists to create an initial variety queue
                        const shuffledArtists = [...artists].sort(() => 0.5 - Math.random());
                        const initialQueue = [];
                        let firstArtist = null;

                        for (const a of shuffledArtists.slice(0, 3)) {
                            const aRes = await getArtistById(a.id || a._id);
                            const aData = aRes?.artist || aRes?.data || aRes;
                            if (aData?.songs?.length > 0) {
                                if (!firstArtist) firstArtist = aData;
                                initialQueue.push(...aData.songs.map(s => ({ ...s, artistContext: aData })));
                            }
                        }

                        if (initialQueue.length > 0) {
                            // Shuffle the initial variety queue
                            initialQueue.sort(() => 0.5 - Math.random());
                            set({ 
                                artist: initialQueue[0].artistContext, 
                                songs: initialQueue, 
                                queue: initialQueue,
                                currentSongIndex: 0 
                            });
                            return;
                        }
                    }
                } catch (err) {
                    console.error("Failed to fetch variety songs:", err);
                }
                
                // Final fallback if backend fails
                const backupSongs = [
                    { id: 'b1', title: 'Seven (feat. Latto)', streamUrl: 'https://www.youtube.com/watch?v=QU9c0053UAU', coverImage: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745' },
                    { id: 'b2', title: 'Perfect Night', streamUrl: 'https://www.youtube.com/watch?v=hLvAuY2R2S4', coverImage: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9' }
                ];
                set({ artist: { artistName: 'Global Trending' }, songs: backupSongs, queue: backupSongs, currentSongIndex: 0 });
            },
            setPlayerState: (state) => set((prev) => {
                // Prevent unnecessary updates if values are the same
                const changed = Object.keys(state).some(key => prev[key] !== state[key]);
                return changed ? { ...prev, ...state } : prev;
            }),
            toggleMinimize: () => set((s) => ({ isMinimized: !s.isMinimized })),
            setVolume: (volume) => set({ volume }),
            
            // Queue Logic (Spotify style)
            buildQueue: async () => {
                const { songs, currentSongIndex } = get();
                if (!songs?.length) return [];
                const queue = [...songs];
                set({ queue });
                return queue;
            },

            playNext: async () => {
                const { currentSongIndex, queue, artist } = get();
                if (!queue.length) return;
                
                // If we are at the end of the queue, fetch a random song from a DIFFERENT artist
                if (currentSongIndex === queue.length - 1) {
                    const { getAllArtists, getArtistById } = await import('../api/artist');
                    try {
                        const res = await getAllArtists();
                        const artists = res?.artists || res?.data || res || [];
                        if (artists.length > 0) {
                            // Filter out current artist to ensure diversity
                            const otherArtists = artists.filter(a => (a.id || a._id) !== (artist?.id || artist?._id));
                            const sourceList = otherArtists.length > 0 ? otherArtists : artists;
                            
                            const randomArtist = sourceList[Math.floor(Math.random() * sourceList.length)];
                            const aRes = await getArtistById(randomArtist.id || randomArtist._id);
                            const aData = aRes?.artist || aRes?.data || aRes;
                            
                            if (aData?.songs?.length > 0) {
                                const randomSong = aData.songs[Math.floor(Math.random() * aData.songs.length)];
                                const newSongEntry = { ...randomSong, artistContext: aData };
                                const newQueue = [...queue, newSongEntry];
                                
                                set({ 
                                    queue: newQueue,
                                    songs: newQueue, // Keep songs and queue in sync for UI
                                    currentSongIndex: currentSongIndex + 1,
                                    artist: aData,
                                    isPlaying: true 
                                });
                                return;
                            }
                        }
                    } catch (err) {
                        console.error("Forced Shuffle Next failed:", err);
                    }
                }

                // Standard next within existing queue
                const nextIdx = (currentSongIndex + 1) % queue.length;
                const nextSong = queue[nextIdx];
                if (nextSong?.artistContext) {
                    set({ artist: nextSong.artistContext });
                }
                set({ currentSongIndex: nextIdx, isPlaying: true });
            },
            
            playPrevious: () => {
                const { currentSongIndex, queue } = get();
                if (!queue.length) return;
                
                // Always go to the previous song in the queue (no restart logic)
                const prevIdx = (currentSongIndex - 1 + queue.length) % queue.length;
                const prevSong = queue[prevIdx];
                if (prevSong?.artistContext) {
                    set({ artist: prevSong.artistContext });
                }
                set({ currentSongIndex: prevIdx, isPlaying: true, progress: 0 });
            },

            playFromQueue: (index) => {
                set({ currentSongIndex: index, isPlaying: true });
            },

            // Legacy playSongs action used by genre/profile pages
            playSongs: (artist, songs, index = 0) => {
                // Inject artist info into every song for UI consistency
                const songsWithArtist = songs.map(s => ({ 
                    ...s, 
                    artistContext: artist 
                }));
                set({ 
                    artist, 
                    songs: songsWithArtist, 
                    queue: songsWithArtist, 
                    currentSongIndex: index, 
                    isPlaying: true 
                });
            },

            // Controls object for easy access in components
            controls: {
                togglePlayPause: () => set((s) => ({ isPlaying: !s.isPlaying })),
                playNext: () => get().playNext(),
                playPrevious: () => get().playPrevious(),
                changeSong: (dir) => dir > 0 ? get().playNext() : get().playPrevious(),
                handleSongSelect: (idx) => get().playFromQueue(idx),
                handleProgressClick: (percent) => set({ _progressRequest: { percent, ts: Date.now() } }),
                setVolume: (v) => set({ volume: v })
            }
        }),
        {
            name: '4b1k-player-storage',
            storage: createJSONStorage(() => localStorage),
            onRehydrateStorage: () => (state) => {
                state?.setPlayerState({ _hasHydrated: true });
            },
            partialize: (state) => ({
                artist: state.artist,
                songs: state.songs,
                queue: state.queue,
                currentSongIndex: state.currentSongIndex,
                volume: state.volume,
                isMinimized: state.isMinimized,
            }),
        }
    )
);
