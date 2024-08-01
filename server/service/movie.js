const { dbPool } = require("../config/dbConnection");
const { checkUserByIdQuery } = require("../query/auth");
const {
  createMovieQuery,
  getMoviesByUserIdQuery,
  deleteMovieByIdQuery,
  getMovieByIdQuery,
  updateMovieByIdQuery,
  getAllMoviesQuery,
} = require("../query/movie");
const { NotFound } = require("../util/requestError");

const createMovie = async (values) => {
  try {
    const [checkUserExistence] = await dbPool.query(checkUserByIdQuery, [
      values[3],
    ]);

    if (checkUserExistence.length !== 1) {
      throw new NotFound("User does not exist!");
    }

    const [createMovie] = await dbPool.query(createMovieQuery, values);

    if (!createMovie) {
      throw new BadRequest("Error occured while creating post");
    }
    const [getMovie] = await dbPool.query(getMovieByIdQuery, [
      createMovie.insertId,
    ]);

    return {
      message: "Post created successfully",
      data: getMovie[0],
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const getPosts = async () => {
  try {
    const [getAllPost] = await dbPool.query(getAllMoviesQuery);

    if (getAllPost.length < 1) {
      throw new NotFound("No record found");
    }
    return {
      message: "Posts fetched successfully",
      data: getAllPost,
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};
const getPost = async (postId) => {
  try {
    const [post] = await dbPool.query(getMovieByIdQuery, [postId]);

    if (post.length < 1) {
      throw new NotFound("No record found");
    }
    return {
      message: "Post fetched successfully",
      data: post[0],
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const getPostsByUserId = async (userId) => {
  try {
    const [posts] = await dbPool.query(getMoviesByUserIdQuery, [userId]);

    if (posts.length < 1) {
      throw new NotFound("No record found");
    }
    return {
      message: "Posts fetched successfully",
      data: posts,
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const updatePost = async (payload) => {
  try {
    const [checkUserExistence] = await dbPool.query(checkUserByIdQuery, [
      payload[4],
    ]);

    if (checkUserExistence.length !== 1) {
      throw new NotFound("User does not exist");
    }

    const [updatePost] = await dbPool.query(updateMovieByIdQuery, payload);

    if (updatePost.affectedRows !== 1) {
      throw new BadRequest("Error occured while updating post");
    }

    return {
      message: "Post updated successfully",
      statusCode: 200,
    };
  } catch (error) {
    throw error;
  }
};

const deletePost = async (userId, postId) => {
  try {
    const [checkUserExistence] = await dbPool.query(checkUserByIdQuery, [
      userId,
    ]);

    if (checkUserExistence.length !== 1) {
      throw new NotFound("User does not exist");
    }

    const [deletePost] = await dbPool.query(deleteMovieByIdQuery, [postId]);
    if (deletePost.affectedRows !== 1) {
      throw new BadRequest("Error occured while deleting post");
    }
    return {
      message: "Post deleted successfully",
      statusCode: 200,
    };
  } catch (error) {
    throw err;
  }
};
module.exports = {
  createMovie,
  getPosts,
  getPost,
  getPostsByUserId,
  updatePost,
  deletePost,
};
