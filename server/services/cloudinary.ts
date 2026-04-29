import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

/**
 * Upload a buffer (from multer memoryStorage) to Cloudinary.
 * Returns the secure URL of the uploaded image.
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  options: {
    folder: string;
    /** Optional: resize width (auto height) */
    width?: number;
    /** Optional: resize height */
    height?: number;
  }
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadOptions: Record<string, unknown> = {
      folder: `futtwitter/${options.folder}`,
      resource_type: "image",
      format: "webp",
      quality: "auto:good",
    };

    // Optional transformations
    if (options.width || options.height) {
      uploadOptions.transformation = [
        {
          ...(options.width && { width: options.width }),
          ...(options.height && { height: options.height }),
          crop: "limit",
        },
      ];
    }

    const stream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error, result) => {
        if (error) {
          reject(new Error(`Cloudinary upload failed: ${error.message}`));
        } else if (result) {
          resolve(result.secure_url);
        } else {
          reject(new Error("Cloudinary upload returned no result"));
        }
      }
    );

    stream.end(buffer);
  });
}

/**
 * Delete an image from Cloudinary by its URL.
 * Extracts the public_id from the URL to delete.
 */
export async function deleteFromCloudinary(url: string): Promise<void> {
  try {
    // Extract public_id from Cloudinary URL
    // URL format: https://res.cloudinary.com/{cloud}/image/upload/v123/futtwitter/folder/filename.ext
    const match = url.match(/\/upload\/(?:v\d+\/)?(futtwitter\/.+)\.\w+$/);
    if (!match) {
      console.warn("Could not extract Cloudinary public_id from URL:", url);
      return;
    }
    const publicId = match[1];
    await cloudinary.uploader.destroy(publicId);
  } catch (error) {
    console.error("Failed to delete from Cloudinary:", error);
  }
}

export default cloudinary;
