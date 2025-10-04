class ApiError extends Error {
  constructor(statusCode, message, errors = [], stack = "") {
    // Call the parent Error constructor with the message
    super(message);

    this.statusCode = statusCode;      // HTTP status code to send
    this.errors = errors;              // Optional array/object of extra error details
    this.success = false;              // Always false for errors
    this.data=null,
    this.message=message

    // Maintain proper stack trace (useful during debugging)
    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };