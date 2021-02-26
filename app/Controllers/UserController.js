import Controller from "./Controller";
import Logger from "../Helpers/Logger";
import UserModel from "../Models/User"

export default class UserController extends Controller {
  constructor(response) {
    super(response);
    this.userModel = new UserModel();
  }

  getUserDetails(request) {
    try {
      this.params = {
        ...request.params,
        ...request.body,
        ...request.context
      };
      const futureObject = this.userModel.getUserDetails(this.params);
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

}