This project constitutes a comprehensive full-stack movie application featuring CRUD (Create, Read, Update, Delete) functionalities, user authentication, and an array of security measures. These include the implementation of cookies, safeguarding against SQL injection, Cross-Site Scripting (XSS), Cross-Site Request Forgery (CSRF) protection, robust authorization mechanisms, two-factor authentication (2FA), and user authentication protocols.

## Getting Started

Clone the Repository: <br>
`git clone <repository-url>`

Navigate to the Server Directory:<br>
`cd be`

Install Dependencies:<br>
`npm install`

### Set Up Environment Variables:

Create a .env file in the server directory using .env.example as the template:

### Run the Server:

`nodemon main.js`

From the root directory, navigate to the Client Directory:<br>
`cd client`

### Run the Client:

`live-server`

### Unit Testing: Running Tests

To run unit tests for the server-side code, navigate to the server directory and execute:

`cd be`

`npm run test`

## Features

- Robust user authentication with secure session management and password hashing.
- CRUD operations for efficient management of movie posts.
- Implementation of CSRF protection to mitigate Cross-Site Request Forgery attacks.
- Authorization checks for controlling access to specific routes or actions based on user roles.
- Secure storage mechanisms for safeguarding sensitive data like passwords and tokens.
- Two-Factor Authentication (2FA) for enhanced security.

## Contributing

Contributions are encouraged! Please feel free to open issues or pull requests for any enhancements or features you wish to propose for inclusion in the project.

## License

This project is licensed under the MIT License.
