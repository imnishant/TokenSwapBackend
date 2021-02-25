import Controller from "./Controller";
import Logger from "../Helpers/Logger";
import TransactionModel from "../Models/Transaction"

export default class TransactionController extends Controller {
  constructor(response) {
    super(response);
    this.transactionModel = new TransactionModel();
  }

  getEtherBalance(request) {
    try {
      this.params = {
        ...request.params,
        ...request.body,
        ...request.context
      };
      const futureObject = this.transactionModel.getEtherBalance(this.params);
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