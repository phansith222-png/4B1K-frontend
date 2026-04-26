import { API_URL } from "../config/env";

/**
 * Utility to handle image URLs.
 * If the image path is relative (starts with /), it prepends the API base URL.
 */
export const getImageUrl = (img, fallback = "") => {
  if (!img) return fallback;
  
  if (img.startsWith('http')) {
    return img;
  }
  
  if (img.startsWith('/')) {
    const baseUrl = API_URL;
    // Remove trailing slash from baseUrl if exists
    const cleanBaseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBaseUrl}${img}`;
  }
  
  return img;
};
