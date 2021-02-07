import Controller from "./Controller";
import Logger from "../Helpers/Logger";
import VerifyModel from "./../Models/Verify"
import { response } from "express";

export default class VerifyController extends Controller {
  constructor(response) {
    super(response);
    this.verifyModel = new VerifyModel();
  }

  /**
  * Pre-registration OTP Request
  * @param {*} request
  */

  preRegistration(request) {
    try {
      this.params = {
        ...request.params,
        ...request.body,
        ...request.context
      };
      const futureObject = this.verifyModel.preRegistration(this.params);
      futureObject.then(response => {
        console.log(response);
        this.sendResponse(response);
      }).catch(error => {
        Logger.info(`Error message: ${error.message}`);
        this.handleException(error);
      });
    } catch (error) {
      Logger.error(`Error message: ${error}`);
      this.handleException(error);
    }
  }

  verifyPreRegistration(request) {
    try {
      this.params = {
        ...request.params,
        ...request.body,
        ...request.context
      };
      const futureObject = this.verifyModel.verifyPreRegistration(this.params);
      futureObject.then(response => {
        console.log(response);
        this.sendResponse(response);
      }).catch(error => {
        Logger.info(`Error message: ${error.message}`);
        this.handleException(error);
      });
    } catch (error) {
      Logger.error(`Error message: ${error}`);
      this.handleException(error);
    }
  }

  register(request) {
    try {
      this.params = {
        ...request.params,
        ...request.body,
        ...request.context
      };
      const futureObject = this.verifyModel.register(this.params);
      futureObject.then(response => {
        console.log(response);
        this.sendResponse(response);
      }).catch(error => {
        Logger.error(`Error message: ${error}`);
        this.handleException(error);
      });
    } catch (error) {
      Logger.error(`Error message: ${error}`);
      this.handleException(error);
    }
  }

  login(request) {
    try {
      this.params = {
        ...request.params,
        ...request.body,
        ...request.context
      };
      const futureObject = this.verifyModel.login(this.params);
      futureObject.then(response => {
        console.log(response);
        this.sendResponse(response);
      }).catch(error => {
        Logger.error(`Error message: ${error}`);
        this.handleException(error);
      });
    } catch (error) {
      Logger.error(`Error message: ${error}`);
      this.handleException(error);
    }
  }

  verifyLogin(request) {
    try {
      this.params = {
        ...request.params,
        ...request.body,
        ...request.context
      };
      const futureObject = this.verifyModel.verifyLogin(this.params);
      futureObject.then(response => {
        console.log(response);
        this.sendResponse(response);
      }).catch(error => {
        Logger.error(`Error message: ${error}`);
        this.handleException(error);
      });
    } catch (error) {
      Logger.error(`Error message: ${error}`);
      this.handleException(error);
    }
  }

}