import cloudinary from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config({ path: 'backend/config/config.env' })

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
})

export const upload_file = async (file, folder) => {
    try {
        const result = await cloudinary.uploader.upload(file, {
            resource_type: "auto",
            folder,
        });
        return {
            public_id: result.public_id,
            url: result.secure_url, // ✅ use secure_url
        };
    } catch (error) {
        throw new Error("Cloudinary upload failed: " + error.message);
    }
}

export const delete_file = async (file) => {
    const res = await cloudinary.uploader.destroy(file);
    return res?.result === "ok";
}
