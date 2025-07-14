import { STATUS_CODES } from "./status-codes";

class BaseError extends Error {
  public readonly name: string;
  public readonly message: string;
  public readonly status: number;

  constructor(name: string, status: number, message: string) {
    super(message);
    this.name = name;
    this.status = status;
    this.message = message;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this);
  }
}

// 500 Internal Error
export class APIError extends BaseError {
  constructor(description = "api error") {
    super(
      "api internal server error",
      STATUS_CODES.INTERNAL_ERROR,
      description
    );
  }
}

// 400 Validation Error
export class ValidationError extends BaseError {
  constructor(description = "bad request") {
    super("bad request", STATUS_CODES.BAD_REQUEST, description);
  }
}

// 403 Authorization Error
export class AuthorizationError extends BaseError {
  constructor(description = "access denied") {
    super("access denied", STATUS_CODES.FORBIDDEN, description);
  }
}

// 404 Not Found Error
export class NotFoundError extends BaseError {
  constructor(description = "not found") {
    super("not found", STATUS_CODES.NOT_FOUND, description);
  }
}
