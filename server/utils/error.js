
/**
 * Create an error object with a status code and a message.
 *
 * @param {number} statusCode
 * @param {string} message
 * @return {Error}
 */
export function errorHandler (statusCode, message) {
  const error = new Error();
  error.statusCode = statusCode;
  error.message = message;
  return error;
};
