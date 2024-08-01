// SQL query to get a movie post by its ID
const getMovieByIdQuery = `SELECT * FROM movies WHERE id = ?`;

// SQL query to get all movie post by user ID
const getMoviesByUserIdQuery = `SELECT * FROM movies WHERE user_id = ?`;

// SQL query to get all movie post
const getAllMoviesQuery = `
SELECT 
  movies.id AS id, 
  movies.title AS title, 
  movies.body AS body, 
  movies.image AS image,
  movies.user_id AS userId, 
  movies.created_at AS created_at, 
  users.first_name AS first_name
FROM 
  movies 
LEFT JOIN 
  users ON users.id = movies.user_id;
`;

// SQL query to create a new movie post
const createMovieQuery = `
  INSERT INTO movies 
  (title, body, image, user_id) 
  VALUES (?,?,?,?) 
`;

// SQL query to update a movie post by its ID and user ID
const updateMovieByIdQuery = `
  UPDATE movies
  SET title = ?,
      body = ?,
      image = ?
  WHERE id = ? AND user_id = ?
`;

// SQL query to delete a movie post by its ID
const deleteMovieByIdQuery = `
  DELETE FROM movies
  WHERE id = ?

`;

// SQL query to delete a movie post by its title
const deleteMovieByTitleQuery = `
  DELETE FROM "movies"
  WHERE title = ?
`;

// Export all SQL queries for use in other modules
module.exports = {
  getMovieByIdQuery,
  getMoviesByUserIdQuery,
  getAllMoviesQuery,
  createMovieQuery,
  updateMovieByIdQuery,
  deleteMovieByIdQuery,
  deleteMovieByTitleQuery,
};
