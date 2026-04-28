import { useEffect } from 'react';
import AppRouter from './router/AppRouter';
import StickyMusicPlayer from './components/StickyMusicPlayer';
import { getAllArtists } from './api/artist';

export default function App() {
  // 🔥 Prefetch all artists on app startup to warm the module-level cache.
  // This ensures that when users navigate to any genre page (/pop, /rock, etc.),
  // getAllArtists() returns immediately from cache instead of hitting the network.
  useEffect(() => {
    getAllArtists().catch(() => { }); // fire-and-forget, errors silently ignored
  }, []);

  return (
    <>
      <AppRouter />
      <StickyMusicPlayer />
    </>
  );
}
