import path from "path";

export const getBaseDir = () => process.env.PWD as string;

/* Folders */
export const contentFolder = path.resolve(getBaseDir(), "./../ylhyra_content");
export const buildFolder = getBaseDir() + "/build";
export const imageOutputFolder = buildFolder + "/images";

export const ylhyraContentFiles = contentFolder + "/not_data/files";

export const uploadPath = path.resolve(getBaseDir(), "./uploads");
