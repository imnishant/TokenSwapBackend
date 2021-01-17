import Controller from './Controller';
import Logger from '../Helpers/Logger';

export default class HealthController extends Controller {
  constructor(response) {
    super(response);
  }

  /**
   * check server
   * @param {*} request
   */

  checkHealth(request) {
    try {
      Logger.info('All Ok from health api');
      this.sendResponse({ msg: 'ALL OK!' });
    } catch (error) {
      this.handleException(error);
    }
  }
}
