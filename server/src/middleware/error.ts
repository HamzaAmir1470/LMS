import ErrorHandler from "../utils/ErrorHandler";

const ErrorMiddleware = (err: any, req: any, res: any, next: any) => {
  err.statusCode = err.statusCode || 500;
  err.message = err.message || "Internal Server Error";

  // wrong mongoose object id error
  if (err.name === "CastError") {
    const message = `Resource not found. Invalid: ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  // Duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // wrong JWT error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid. Try again!!!";
    err = new ErrorHandler(message, 400);
  }

  // JWT expired error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token is expired. Try again!!!";
    err = new ErrorHandler(message, 400);
  }

  res.status(err.statusCode).json({
    status: "error",
    statusCode: err.statusCode,
    message: err.message,
  });
};

export default ErrorMiddleware;
