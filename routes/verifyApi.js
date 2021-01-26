import express from "express";
import VerifyController from "../app/Controllers/VerifyController";

const TwilioVerifyAPIRouter = express.Router();

TwilioVerifyAPIRouter.post("/v1/preRegistration/", (request, response) => {
  const verifyController = new VerifyController(response);
  verifyController.preRegistration(request);
});

export default TwilioVerifyAPIRouter;