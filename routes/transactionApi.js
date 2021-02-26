import express, { request, response } from "express";
import TransactionController from "../app/Controllers/TransactionController";

const TransactionAPIRouter = express.Router();

TransactionAPIRouter.get("/v1/getEtherBalance/", (request, response) => {
  const transactionController = new TransactionController(response);
  transactionController.getEtherBalance(request);
});

export default TransactionAPIRouter;