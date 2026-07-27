import imagekit from '../config/imagekit.js';

export const uploadToImageKit = async (file, folder) => {
    const ik = imagekit();
    const result = await ik.upload({
        file: file.buffer.toString('base64'),
        fileName: `${Date.now()}-${file.originalname}`,
        folder,
    });
    return result.url;
};