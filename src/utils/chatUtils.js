/**
 * Utility functions for Chat UI
 * @module chatUtils
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

/**
 * Returns the proper avatar URL, generating a random one if none provided,
 * and prepending the API URL if it's a relative backend path.
 * 
 * @param {string} name - User's name.
 * @param {string} [img] - User's profile image URL or relative path.
 * @returns {string} The formatted avatar URL.
 */
export const avatarUrl = (name, img) => {
  if (!img) {
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=random&color=fff`;
  }
  
  if (img.startsWith('/')) {
    return `${API_URL}${img}`;
  }
  
  return img;
};
