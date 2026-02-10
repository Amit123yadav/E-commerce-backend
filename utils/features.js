import DatauriParser from "datauri/parser.js";
import path from "path";

const parser = new DatauriParser();

export const getDataUri = (file) => {
  if (!file) {
    throw new Error("No file received");
  }

  const extname = path.extname(file.originalname);

  return parser.format(extname, file.buffer);
};
