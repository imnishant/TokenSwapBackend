/**
 * Handler for all error exceptions
 * @param error
 * @return error object
 */
export default class Exception extends Error {
  constructor() {
    super();
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, Exception);
    }
  }
}
