import { GENRE_ARTIST_IDS } from '../constants/genreArtistIds';

export const GENRE_COLORS = {
  POP: "#FF007F",
  ROCK: "#D3131F",
  CLASSIC: "#da45ffff", 
  HIPHOP: "#00E5FF",
  EDM: "#7000FF",
  DEFAULT: "#00E5FF"
};

export const getArtistPathById = (id) => {
  if (!id || id.toString().startsWith('mock')) return '#';
  const aId = Number(id);
  
  if (GENRE_ARTIST_IDS.pop.includes(aId)) return '/pop';
  if (GENRE_ARTIST_IDS.rock.includes(aId)) return '/rock';
  if (GENRE_ARTIST_IDS.classic.includes(aId)) return '/rnb';
  if (GENRE_ARTIST_IDS.etc.includes(aId)) return '/etc';
  
  return '/artists';
};

export const getGenreColorByName = (genresArray) => {
  if (!genresArray || !genresArray.length) return GENRE_COLORS.DEFAULT;
  const gName = (genresArray[0]?.genre?.name || "").toLowerCase();

  if (gName.includes("pop")) return GENRE_COLORS.POP;
  if (gName.includes("rock")) return GENRE_COLORS.ROCK;
  if (gName.includes("r&b") || gName.includes("classic")) return GENRE_COLORS.CLASSIC;
  if (gName.includes("hip hop") || gName.includes("rap")) return GENRE_COLORS.HIPHOP;
  if (gName.includes("edm") || gName.includes("electronic")) return GENRE_COLORS.EDM;
  return GENRE_COLORS.DEFAULT;
};

export const getGenreColorByArtistId = (id) => {
  if (!id) return GENRE_COLORS.DEFAULT;
  const aId = Number(id);

  if (GENRE_ARTIST_IDS.pop.includes(aId)) return GENRE_COLORS.POP;
  if (GENRE_ARTIST_IDS.rock.includes(aId)) return GENRE_COLORS.ROCK;
  if (GENRE_ARTIST_IDS.classic.includes(aId)) return GENRE_COLORS.CLASSIC;
  
  if (GENRE_ARTIST_IDS.hiphop.includes(aId)) return GENRE_COLORS.HIPHOP;
  if (GENRE_ARTIST_IDS.edm.includes(aId)) return GENRE_COLORS.EDM;
  
  return GENRE_COLORS.DEFAULT;
};
