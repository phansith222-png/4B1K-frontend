/**
 * Artist IDs grouped by music genre.
 * Update these arrays when new artists are added to the database.
 */
const HIPHOP_IDS = [11, 12, 13, 14, 15];
const EDM_IDS = [21, 22, 23, 24, 25];

export const GENRE_ARTIST_IDS = {
    pop:     [1, 2, 3, 4, 5],
    rock:    [6, 7, 8, 9, 10],
    classic: [16, 17, 18, 19, 20],
    hiphop:  HIPHOP_IDS,
    edm:     EDM_IDS,
    etc:     [...HIPHOP_IDS, ...EDM_IDS],
};
