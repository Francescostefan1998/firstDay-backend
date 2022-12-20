import express from "express";
import listEndpoints from "express-list-endpoints";
import albumsRouter from "./api/albums/index.js";

const server = express();

const port = 3003;
server.use(express.json());
server.use("/albums", albumsRouter);
server.listen(port, () => {
  console.log("server running on :", port);
  console.table(listEndpoints(server));
});
