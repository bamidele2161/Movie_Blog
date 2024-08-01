// General custom error
class CustomError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// General BadRequest error
class BadRequest extends CustomError {
  constructor(message = "Bad Request") {
    super(message, 400);
  }
}

// General Unauthorized error
class Unauthorized extends CustomError {
  constructor(message = "Unauthorized") {
    super(message, 401);
  }
}

// General Forbidden error
class Forbidden extends CustomError {
  constructor(message = "Forbidden") {
    super(message, 403);
  }
}

// General not found error
class NotFound extends CustomError {
  constructor(message = "Not Found") {
    super(message, 404);
  }
}

module.exports = {
  CustomError,
  BadRequest,
  Unauthorized,
  Forbidden,
  NotFound,
};
