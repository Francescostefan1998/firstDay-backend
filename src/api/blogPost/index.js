import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import { checksBlogsSchema, triggerBadRequest } from "./validator.js";
import { getAlbums, writeAlbums, getBlogPost } from "../../lib/fs-tools.js";
const { NotFound, Unauthorized, BadRequest } = httpErrors;

const blogPostRouter = express.Router();

blogPostRouter.post(
  "/",
  checksBlogsSchema,
  triggerBadRequest,
  async (req, resp, next) => {
    try {
      const newBlogPost = { ...req.body, createdAte: new Date(), id: uniqid() };
      const blogPostArray = getBlogPost();
      blogPostArray.push(newBlogPost);
      await writeBlogPost(blogPostArray);
      res.status(201).send({ id: newBlogPost.id });
    } catch (error) {
      next(error);
    }
  }
);
blogPostRouter.get("/", async (req, res, next) => {
  try {
    const blogPostArray = await getBlogPost();
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
blogPostRouter.get("/:blogPostId", async (req, res, next) => {
  try {
    const blogs = await getBlogPost();
    const blog = blogs.find((blog) => blog.id === req.params.blogPostId);
    if (blog) {
      res.send(blog);
    } else {
      next(NotFound(`Blog with id ${req.params.blogPostId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

blogPostRouter.put("/:blogPostId", async (req, resp, next) => {
  try {
    const blogs = await getBlogPost();
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
blogPostRouter.delete("/:blogPostId", async (req, res, next) => {
  try {
    const blogs = await getBlogPost();
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
