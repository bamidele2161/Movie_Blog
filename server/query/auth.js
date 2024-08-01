// SQL query to check if a user with a specific email exists
const checkUserByEmailQuery = `SELECT * FROM users WHERE email = ?`;

// SQL query to check if a user with a specific reset code and email exists
const checkUserByResetCodeQuery = `SELECT * FROM users WHERE resetcode = ? AND email = ?`;

const checkQRCodeExistenceQuery = `SELECT * FROM users WHERE qrcode = ? AND email = ?`;

// SQL query to check if a user with a specific ID exists
const checkUserByIdQuery = `SELECT * FROM users WHERE id = ?`;

// SQL query to create a new user
const createUserQuery =
  "INSERT INTO users (first_name, last_name, email, password) VALUES (?, ?, ?, ?)";

// SQL query to update user's reset code and password by ID
const updateUserCodeByIdQuery = `
  UPDATE users
  SET qrcode = null,
  enabled = ?
  WHERE id = ? 
`;
const updateUserPasswordQuery = `
  UPDATE users
  SET resetcode = null,
  password = ?
  WHERE id = ? 
  
`;
// SQL query to update user's reset code by ID
const updateUserResetQRCodeByIdQuery = `
  UPDATE users
  SET qrcode = ?
  WHERE id = ? 
`;

const updateUserResetCodeByIdQuery = `
  UPDATE users
  SET resetcode = ?
  WHERE id = ? 
`;

// SQL query to delete a user by email
const deleteUserByEmailQuery = `
  DELETE FROM users
  WHERE email = ?

`;

// Export all SQL queries for use in other modules
module.exports = {
  checkUserByEmailQuery,
  checkUserByResetCodeQuery,
  checkUserByIdQuery,
  createUserQuery,
  updateUserCodeByIdQuery,
  updateUserResetQRCodeByIdQuery,
  updateUserPasswordQuery,
  deleteUserByEmailQuery,
  checkQRCodeExistenceQuery,
  updateUserResetCodeByIdQuery,
};
