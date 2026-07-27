import multer from 'multer';

const storage = multer.memoryStorage(); // keeps file in memory as a buffer, never written to disk
const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB cap
});

export default upload;