import express from "express";
import listEndpoints from "express-list-endpoints";
import albumsRouter from "./api/albums/index.js";
import cors from "cors";
import { join } from "path";
import blogPostRouter from "./api/blogPost/index.js";
import filesRouter from "./api/files/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandlers.js";
const server = express();

const port = 3002;
const publicFolderPath = join(process.cwd(), "./public");
const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} --url ${req.url} -- ${new Date()}`);
  req.album = "Album";
  next();
};

server.use(express.static(publicFolderPath));

server.use(cors());
server.use(loggerMiddleware);
server.use(express.json());
server.use("/albums", loggerMiddleware, albumsRouter);
server.use("/blogPost", loggerMiddleware, blogPostRouter);
server.use("/files", loggerMiddleware, filesRouter);
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);
server.listen(port, () => {
  console.log("server running on :", port);
  console.table(listEndpoints(server));
});
