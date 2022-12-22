import { checkSchema, validationResult } from "express-validator";
import createHttpError from "http-errors";

const { BadRequest, NotFound } = createHttpError;

/*

const
{	
"_id": "SERVER GENERATED ID",
"category": "ARTICLE CATEGORY",
"title": "ARTICLE TITLE",
"cover":"ARTICLE COVER (IMAGE LINK)",
"readTime": {
	"value": 2,
  "unit": "minute"
 },
"author": {
    "name": "AUTHOR AVATAR NAME",
    "avatar":"AUTHOR AVATAR LINK"
    },
 "content":"HTML",
 "createdAt": "NEW DATE"
}

*/
const blogPostSchema = {
  title: {
    in: ["body"],
    isString: {
      errorMessage: "Title is mandatory and must be a string",
    },
  },
  category: {
    in: ["body"],
    isString: {
      errorMessage: "Category is mandatory and must be a string",
    },
  },
  cover: {
    in: ["body"],
    isString: {
      errorMessage: "Cover is mandatory and must be a link",
    },
  },
  readTime: {
    in: ["body"],
    isObject: {
      errorMessage: "readTime is mandatory and must be an object",
    },
  },
  author: {
    in: ["body"],
    isObject: {
      errorMessage: "author is mandatory and must be an object",
    },
  },
  content: {
    in: ["body"],
    isString: {
      errorMessage: "content is mandatory and must be a string",
    },
  },
};

export const checksBlogsSchema = checkSchema(blogPostSchema);

export const triggerBadRequest = (req, res, next) => {
  const errors = validationResult(req);
  console.log(errors.array());

  if (!errors.isEmpty()) {
    next(
      BadRequest("Errors during validation", { errorsList: errors.array() })
    );
  } else {
    next();
  }
};
