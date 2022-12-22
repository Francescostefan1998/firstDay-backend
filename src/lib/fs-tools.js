import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";

const { readJSON, writeJSON, writeFile } = fs;

const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/albums");

console.log("ROOT OF THE ROJECT:", process.cwd());
console.log("Pubblic folder:", publicFolderPath);

console.log("DATA FOLDER PATH: ", dataFolderPath);

const albumsJSONPath = join(dataFolderPath, "albums.json");
const blogPostJSONPath = join(dataFolderPath, "blogPost.json");

export const getAlbums = () => readJSON(albumsJSONPath);
export const writeAlbums = (albumsArray) =>
  writeJSON(albumsJSONPath, albumsArray);

export const getBlogPost = () => readJSON(blogPostJSONPath);
export const writeBlogPost = (blogPostArray) => writeJSON(blogPostJSONPath);

export const saveArtistAvatars = (fileName, contentAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), contentAsABuffer);
