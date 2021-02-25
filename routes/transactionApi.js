import express, { request, response } from "express";
import TransactionController from "../app/Controllers/TransactionController";

const TwilioTransactionAPIRouter = express.Router();

TwilioTransactionAPIRouter.get("/v1/getEtherBalance/", (request, response) => {
  const transactionController = new TransactionController(response);
  transactionController.getEtherBalance(request);
});

export default TwilioTransactionAPIRouter;