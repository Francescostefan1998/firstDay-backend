import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
const albumsRouter = express.Router();

console.log(import.meta.url);
console.log(fileURLToPath(import.meta.url));
console.log(dirname(fileURLToPath(import.meta.url)));
console.log(join(dirname(fileURLToPath(import.meta.url))), "albums.json");
const albumsJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "albums.json"
);
console.log(albumsJSONPath);

albumsRouter.post("/", (req, resp) => {
  console.log(req.body);
  const newAlbum = { ...req.body, createdAt: new Date(), ID: uniqid() };
  console.log(newAlbum);

  const albumsArray = JSON.parse(fs.readFileSync(albumsJSONPath));
  albumsArray.push(newAlbum);

  fs.writeFileSync(albumsJSONPath, JSON.stringify(albumsArray));
  resp.send({ message: "hello post" });
  console.log("hello");
});

albumsRouter.get("/", (req, resp) => {
  const fileContent = fs.readFileSync(albumsJSONPath);
  console.log(fileContent);
  const albumsArray = JSON.parse(fileContent);
  console.log(albumsArray);
  resp.send(albumsArray);
});

albumsRouter.get("/:albumId", (req, resp) => {
  const albumID = req.params.albumId;
  const albumsArray = JSON.parse(fs.readFileSync(albumsJSONPath));
  const findAlbum = albumsArray.find((album) => album.ID === albumID);

  resp.send(findAlbum);
});

albumsRouter.put("/:albumId", (req, resp) => {
  const albumsArray = JSON.parse(fs.readFileSync(albumsJSONPath));
  const index = albumsArray.findIndex(
    (album) => album.ID === req.params.albumId
  );
  const oldAlbum = albumsArray[index];
  const updateAlbum = { ...oldAlbum, ...req.body, updatedAt: new Date() };
  albumsArray[index] = updateAlbum;
  fs.writeFileSync(albumsJSONPath, JSON.stringify(albumsArray));
  resp.send(updateAlbum);
});

albumsRouter.delete("/:albumId", (req, resp) => {
  const albumsArray = JSON.parse(fs.readFileSync(albumsJSONPath));
  const remainingAlbums = albumsArray.filter(
    (album) => album.ID !== req.params.albumId
  );

  fs.writeFileSync(albumsJSONPath, JSON.stringify(remainingAlbums));
  resp.send({ message: "hello delete id" });
});

export default albumsRouter;
