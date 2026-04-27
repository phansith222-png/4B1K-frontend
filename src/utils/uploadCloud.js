import axios from "axios";
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from "../config/env";

/**
 * Upload a single File object to Cloudinary.
 * Returns the secure_url string on success, or null on failure.
 * Always validates that a real URL string is returned.
 */
export const uploadToCloudinary = async (file) => {
  if (!file || !(file instanceof File)) {
    console.warn("uploadToCloudinary: invalid file argument", file);
    return null;
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  try {
    const resp = await axios.post(
      CLOUDINARY_UPLOAD_URL,
      formData,
      {
        // Do NOT set Content-Type manually for FormData – let axios handle it
        headers: { "Content-Type": undefined },
      }
    );

    const url = resp.data?.secure_url;

    if (typeof url !== "string" || !url.startsWith("http")) {
      console.error("uploadToCloudinary: unexpected response", resp.data);
      return null;
    }

    console.log("uploadToCloudinary ✅", url);
    return url;
  } catch (error) {
    console.error("uploadToCloudinary ❌", error?.response?.data || error.message);
    return null;
  }
};