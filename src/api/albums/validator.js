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
const albumsSchema = {
  name: {
    in: ["body"],
    isString: {
      errorMessage: "Title is mandatory and must be a string",
    },
  },
};

export const checksAlbumsSchema = checkSchema(albumsSchema);

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
