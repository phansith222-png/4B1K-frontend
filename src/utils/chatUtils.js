import { getImageUrl } from './imageUtils';

export const avatarUrl = (name, img) => {
  const fallback = `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=random&color=fff`;
  return getImageUrl(img, fallback);
};
