import express, { request, response } from "express";
import TransactionController from "../app/Controllers/TransactionController";

const TransactionAPIRouter = express.Router();

TransactionAPIRouter.get("/v1/getEtherBalance/", (request, response) => {
  const transactionController = new TransactionController(response);
  transactionController.getEtherBalance(request);
});

TransactionAPIRouter.get("/v1/getBCDBalance/", (request, response) => {
  const transactionController = new TransactionController(response);
  transactionController.getBCDBalance(request);
});

export default TransactionAPIRouter;