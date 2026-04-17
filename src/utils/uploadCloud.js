import axios from "axios";

export const uploadToCloudinary = async (file) => {
    if (!file) return null;
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', '4B1K_unsigned');
    
    try {
        const resp = await axios.post(
            'https://api.cloudinary.com/v1_1/dvpcypwok/image/upload', 
            formData
        );
        console.log('uploadCloud : resp', resp.data);
        return resp.data.secure_url;
    } catch (error) {
        console.error("Error uploading to Cloudinary:", error);
        return null;
    }
};