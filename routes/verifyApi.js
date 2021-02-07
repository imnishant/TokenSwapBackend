import express, { request, response } from "express";
import VerifyController from "../app/Controllers/VerifyController";

const TwilioVerifyAPIRouter = express.Router();

TwilioVerifyAPIRouter.post("/v1/preRegistration/", (request, response) => {
  const verifyController = new VerifyController(response);
  verifyController.preRegistration(request);
});

TwilioVerifyAPIRouter.post("/v1/verifyPreRegistration", (request, response) => {
  const verifyController = new VerifyController(response);
  verifyController.verifyPreRegistration(request);
});

TwilioVerifyAPIRouter.post("/v1/register", (request, response) => {
  const verifyController = new VerifyController(response);
  verifyController.register(request);
})

TwilioVerifyAPIRouter.post("/v1/login", (request, response) => {
  const verifyController = new VerifyController(response);
  verifyController.login(request);
})

TwilioVerifyAPIRouter.post("/v1/verifyLogin", (request, response) => {
  const verifyController = new VerifyController(response);
  verifyController.verifyLogin(request);
})

export default TwilioVerifyAPIRouter;