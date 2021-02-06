import Joi from '@hapi/joi';
import Logger from '../Helpers/Logger';
import * as Exceptions from '../Exceptions/Exceptions';

export default class Contoller {
  constructor(response) {
    this.response = response;
  }

  /**
     * validate params
     * @param {} request
     * @param {} validationSchema
     * @param {} withAccountUser
     */
  validateParams(request, validationSchema, withAccountUser = false, queryParams = false) {
    if (
      withAccountUser
            && !request.context.account
            && !request.context.user
    ) {
      throw (new Exceptions.UnauthorizedException('invalid token provided'));
    }

    if (validationSchema) {
      let temp = request.body;
      if (queryParams) {
        temp = request.query;
      }
      const {
        error,
        value,
      } = Joi.validate(temp, validationSchema);
      if (error) {
        throw (new Exceptions.ValidationException(error.details[0].message));
      }
      return value;
    }

    return null;
  }

  validateInternalParams(request, validationSchema, queryParams = false) {
    if (validationSchema) {
      let temp = request.body;
      if (queryParams) {
        temp = request.query;
      }
      const {
        error,
        value,
      } = Joi.validate(temp, validationSchema);
      if (error) {
        throw (new Exceptions.ValidationException(error.details[0].message));
      }
      return value;
    }

    return null;
  }

  /**
     * common method for sending success response
     * @param {*} data
     */
  sendResponse(data) {
    this.response.status(200).json({
      data,
    });
  }

  /**
     * method for handling exceptions
     * @param {*} error
     */
  handleException(error) {
    // console.log(error);
    // masking db exceptions
    if (error.sql) {
      error.name = 'DbException';
    }

    switch (error.name) {
      case 'GeneralException':
        this.response.status(501).json({
          error: error.message,
        });
        Logger.error(new Error(error));
        break;
      case 'UnauthorizedException':
        Logger.error('UnauthorizedException: %s', error.message);
        this.response.status(401).json({
          error: error.message,
        });
        break;
      case 'NotFoundException':
        Logger.error('NotFoundException: %s', error.message);
        this.response.status(404).json({
          error: error.message,
        });
        break;
      case 'ConflictException':
        Logger.error('ConflictException: %s', error.message);
        this.response.status(409).json({
          error: error.message,
        });
        break;
      case 'ValidationException':
        Logger.error('ValidationException: %s', error.message);
        this.response.status(422).json({
          error: error.message,
        });
        break;
      case '"DBException"':
        Logger.error('"DBException": %s', error.message);
        this.response.status(422).json({
          error: error.message,
        });
        break;
      case 'ForbiddenException':
        Logger.error('ForbiddenException: %s', error.message);
        this.response.status(403).json({
          error: error.message,
        });
        break;
      case 'TwilioVerifyError':
        Logger.error('TwilioVerifyError: %s', error.message);
        this.response.status(401).json({
          error: error.message,
        });
        break;
      case "UserExistException":
        Logger.error("UserExistException: %s", error.message);
        this.response.status(400).json({
          error: error.message,
        });
        break;
      case "InvalidOTP":
        Logger.error("InvalidOTP: %s", error.message);
        this.response.status(400).json({
          error: error.message,
        });
        break;
      case 'GraphQLError':
        Logger.error(error.message);
        this.response.status(400).json({
          error: error.message,
        });
        break;
      default:
        Logger.error(new Error(error));
        this.response.status(501).json({
          error: 'unable to process request!, please try later',
        });
        break;
    }
  }
}
