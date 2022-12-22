import express from "express";
import multer from "multer";
import { extname } from "path";
import {
  saveArtistAvatars,
  getAlbums,
  writeAlbums,
} from "../../lib/fs-tools.js";

const filesRouter = express.Router();

filesRouter.post(
  "/:albumId/single",
  multer().single("avatar"),
  async (req, res, next) => {
    try {
      const originalFileExtension = extname(req.file.originalname);
      const fileName = req.params.albumId + originalFileExtension;
      await saveArtistAvatars(fileName, req.file.buffer);
      const url = `http://localhost:3002/img/albums/${fileName}`;
      const albums = await getAlbums();
      const index = albums.findIndex((album) => album.id === req.paramsalbumId);
      if (index !== -1) {
        const oldAlbum = albums[index];
        const artist = { ...oldAlbum.artist, avatar: url };
        const updateAlbum = { ...oldAlbum, artist, updatedAt: new Date() };
        albums[index] = updateAlbum;
        await writeAlbums(albums);
      } else {
        res.send("file uploaded");
      }
    } catch (error) {
      next(error);
    }
  }
);

/*filesRouter.post(
  "/multiple",
  multer().array("avatars"),
  async (req, res, next) => {
    try {
      console.log("Files:", req.files);
      await Promise.all(
        req.files.map((file) =>
          saveArtistAvatars(file.originalname, file.buffer)
        )
      );
      res.send("file uploaded");
    } catch (error) {
      next(error);
    }
  }
);*/

export default filesRouter;
