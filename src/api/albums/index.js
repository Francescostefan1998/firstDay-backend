import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checksAlbumsSchema, triggerBadRequest } from "./validator.js";
import {
  getAlbums,
  writeAlbums,
  getBlogPost,
  writeBlogPost,
} from "../../lib/fs-tools.js";
const { NotFound, Unauthorized, BadRequest } = httpErrors;
const albumsRouter = express.Router();

albumsRouter.post(
  "/",
  checksAlbumsSchema,
  triggerBadRequest,
  async (req, resp, next) => {
    try {
      const newAlbum = { ...req.body, createdAt: new Date(), ID: uniqid() };
      const albumsArray = await getAlbums();
      albumsArray.push(newAlbum);
      await writeAlbums(albumsArray);
      resp.status(201).send({ ID: newAlbum.ID });
    } catch (error) {
      next(error);
    }
  }
);

albumsRouter.get("/", async (req, resp, next) => {
  try {
    const albumsArray = await getAlbums();
    if (req.query && req.query.category) {
      const filterBlogPost = albumsArray.filter(
        (blog) => blog.category === req.query.category
      );
      resp.send(filterBlogPost);
    } else {
      resp.send(albumsArray);
    }
  } catch (error) {
    next(error);
  }
});

albumsRouter.get("/:albumId", async (req, resp, next) => {
  try {
    const albumsArray = await getAlbums();
    const findAlbum = albumsArray.find(
      (album) => album.ID === req.params.albumId
    );
    if (findAlbum) {
      resp.send(findAlbum);
    } else {
      next(NotFound(`Album wit id : ${req.params.albumId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

albumsRouter.put("/:albumId", async (req, resp, next) => {
  try {
    const albumsArray = await getAlbums();
    const index = albumsArray.findIndex(
      (album) => album.ID === req.params.albumId
    );
    if (index !== -1) {
      const oldAlbum = albumsArray[index];
      const updateAlbum = { ...oldAlbum, ...req.body, updatedAt: new Date() };
      albumsArray[index] = updateAlbum;
      writeAlbums(albumsArray);
      resp.send(updateAlbum);
    } else {
      next(NotFound(`Album with id : ${req.params.albumId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

albumsRouter.delete("/:albumId", async (req, resp, next) => {
  try {
    const albumsArray = await getAlbums();
    const remainingAlbums = albumsArray.filter(
      (album) => album.ID !== req.params.albumId
    );
    if (albumsArray.length !== remainingAlbums.length) {
      writeAlbums(remainingAlbums);
      resp.status(204).send({ message: "hello delete id" });
    } else {
      next(NotFound(`Album with id ${req.params.albumId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default albumsRouter;
