const request = require("supertest"); // Import the supertest library for making HTTP requests

const { app } = require("../main"); // Import the main application object

// Assuming dbPool comes from a configuration file for database connection
const { dbPool } = require("../config/dbConnection");

const { deleteUserByEmailQuery } = require("../query/auth"); // Import the query for deleting a user by email

describe("All user endpoints test", () => {
  let csrfToken; // Stores the CSRF token retrieved before tests
  let cookies; // Stores the cookies retrieved from the CSRF token request

  beforeAll(async () => {
    const email = "new4@gmail.com"; // Email to be used for test user creation and cleanup

    // Cleanup any existing user with the test email before tests
    const deletePost = await dbPool.query(deleteUserByEmailQuery, [email]);

    // Get a CSRF token for subsequent requests requiring authentication
    const csrfResponse = await request(app).get("/csrf-token").expect(200);
    csrfToken = csrfResponse.body.csrfToken;
    cookies = csrfResponse.headers["set-cookie"]; // Capture cookies from the response
  });

  const data = {
    // Data used for user creation
    first_name: "new",
    last_name: "new",
    email: "new4@gmail.com",
    password: "12345678",
  };

  it("should create a new user", async () => {
    const res = await request(app) // Send a POST request to the user creation endpoint
      .post("/user")
      .send(data) // Send the user data in the request body
      .set("Cookie", cookies) // Include the retrieved cookies in the request
      .set("CSRF-Token", csrfToken); // Include the CSRF token in the request header

    expect(res.statusCode).toBe(200); // Assert the expected status code (200 for success)
    expect(res.body.message).toBe("Account created successfully"); // Assert the success message
    expect(res.body?.data?.email).toBe(data.email); // Assert the created user's email matches the provided data

    // If successful, store the user ID for potential use in later tests
    id = res?.body?.data?.id;
  });

  it("should return a 400 for duplicate email", async () => {
    const res = await request(app) // Attempt to create a user with the same email again
      .post("/user")
      .send(data)
      .set("Cookie", cookies)
      .set("CSRF-Token", csrfToken);
    expect(res.statusCode).toBe(400); // Assert a bad request status code (400)
    expect(res.body.error).toBe("Email already exists"); // Assert the expected error message
  });

  it("should return a 200 for successful login", async () => {
    const data = {
      // Login data with a different email
      password: "11111111",
      email: "login@gmail.com",
    };
    const res = await request(app) // Send a POST request to the login endpoint
      .post("/user/login")
      .send(data)
      .set("Cookie", cookies)
      .set("CSRF-Token", csrfToken);
    expect(res.body.message).toBe("User login successfully"); // Assert the success message
    expect(res.statusCode).toBe(200); // Assert the expected status code (200)
    expect(res.body?.data?.email).toBe(data.email); // Assert the logged-in user's email matches the provided data
  });

  it("should return a 404 for non-existent user login", async () => {
    const data = {
      // Login data with an unknown email
      email: "femade@gmail.com",
      password: "11111111",
    };
    const res = await request(app) // Send a POST request to the login endpoint
      .post("/user/login")
      .send(data)
      .set("Cookie", cookies)
      .set("CSRF-Token", csrfToken);
    expect(res.statusCode).toBe(404); // Assert a not found status code
  });

  it("should return a 400", async () => {
    const data = {
      // Login data with an invalid passoword
      email: "login@gmail.com",
      password: "111",
    };
    const res = await request(app) // Send a POST request to the login endpoint
      .post("/user/login")
      .send(data)
      .set("Cookie", cookies)
      .set("CSRF-Token", csrfToken);
    expect(res.statusCode).toBe(400); // Assert invalid status code
  });
});
