import { Request, Response } from 'express';
import GenericError from './GenericError';

/**
 * A more focus error handling system built around end point error.
 */
export default class ApiError extends GenericError {
  private response: Response;
  private request: Request;
  private error: Error;
  private code: number;
  private header: string;
  private description: string;

  /**
   * A generic handler for all api errors
   * @param request The api request
   * @param response The api response
   * @param {Error} error The error to be processed from the api
   * @param {number} code The error code that will be send to the user
   * @param {string} header The header of the generic message
   * @param {string} description The error message in full that the user will get
   */
  constructor(request: Request, response: Response, error: Error, code: number, header: string, description: string) {
    super(error);

    this.response = response;
    this.request = request;
    this.error = error;
    this.code = code;
    this.header = header;
    this.description = description;
  }

  /**
   * Send a formatted response that is better structured for hte user
   */
  public sendJsonResponse() {
    this.response.status(this.code).send({
      description: this.description,
      error: this.header,
    });
  }
}
