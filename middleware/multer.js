import multer from "multer";

const storage = multer.memoryStorage();

export const singleStorage = multer({ storage }).single("file");
