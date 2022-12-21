import express from "express";
import { fileURLToPath } from "url";
import uniqid from "uniqid";
import fs from "fs";
import httpErrors from "http-errors";
import { checksBlogsSchema, triggerBadRequest } from "./validator.js";
import { dirname, join } from "path";
const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogPostRouter = express.Router();

const blogPostJSONPath = join(
  dirname(fileURLToPath(import.meta.url)),
  "blogPost.json"
);

const anotherStupidMiddleware = (req, res, next) => {
  console.log("stupid middleware triggered");
  next();
};

const getBlogPost = () => JSON.parse(fs.readFileSync(blogPostJSONPath));
const writeBlogPost = (blogPostArray) =>
  fs.writeFileSync(blogPostJSONPath, JSON.stringify(blogPostArray));

blogPostRouter.post(
  "/",
  checksBlogsSchema,
  triggerBadRequest,
  (req, resp, next) => {
    try {
      const newBlogPost = { ...req.body, createdAte: new Date(), id: uniqid() };
      const blogPostArray = getBlogPost();
      blogPostArray.push(newBlogPost);
      writeBlogPost(blogPostArray);
      res.status(201).send({ id: newBlogPost.id });
    } catch (error) {
      next(error);
    }
  }
);
blogPostRouter.get("/", anotherStupidMiddleware, (req, res, next) => {
  try {
    const blogPostArray = getBlogPost();
    if (req.query && req.query.category) {
      const filterBlogPost = blogPostArray.filter(
        (blog) => blog.category === req.query.category
      );
      res.send(filterBlogPost);
    } else {
      res.send(blogPostArray);
    }
  } catch (error) {
    next(error);
  }
});
blogPostRouter.get(
  "/:blogPostId",
  anotherStupidMiddleware,
  (req, res, next) => {
    try {
      const blogs = getBlogPost();
      const blog = blogs.find((blog) => blog.id === req.params.blogPostId);
      if (blog) {
        res.send(blog);
      } else {
        next(NotFound(`Blog with id ${req.params.blogPostId} not found`));
      }
    } catch (error) {
      next(error);
    }
  }
);

blogPostRouter.put("/:blogPostId", (req, resp, next) => {
  try {
    const blogs = getBlogPost();
    const index = blogs.findIndex((blog) => blog.id === req.params.blogPostId);
    if (index !== -1) {
      const oldBlog = blogs[index];
      const updateBlog = { ...oldBlog, ...req.body, updatedAt: new Date() };
      blogs[index] = updateBlog;
      writeBlogPost(blogs);
      res.send(updateBlog);
    } else {
      next(NotFound(`Blog with id ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
blogPostRouter.delete("/:blogPostId", (req, res, next) => {
  try {
    const blogs = getBlogPost();
    const remainingBlogPost = blogs.filter(
      (blog) => blog.id !== blog.params.blogPostId
    );
    if (blogs.length !== remainingBlogPost.length) {
      writeBlogPost(remainingBlogPost);
      res.status(204).send();
    } else {
      next(NotFound(`Blog with id ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default blogPostRouter;
