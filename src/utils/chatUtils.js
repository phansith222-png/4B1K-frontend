export const avatarUrl = (name, img) =>
  img || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=random&color=fff`;
