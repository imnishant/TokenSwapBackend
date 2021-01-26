import Controller from "./Controller";
import Logger from "../Helpers/Logger";
import VerifyModel from "./../Models/Verify"

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
      const verifyPreRegModel = this.verifyModel.preRegistration(this.params);
      verifyPreRegModel.then((response) => {
        console.log(response);
        this.sendResponse(response);
      }).catch((error) => {
        Logger.info(`Error message: ${error.message}`);
        this.handleException(error);
      });
    } catch (error) {
      Logger.error(`Error message: ${error}`);
      this.handleException(error);
    }
  }
}