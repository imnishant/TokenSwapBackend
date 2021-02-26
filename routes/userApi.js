import express, { request, response } from "express";
import UserController from "../app/Controllers/UserController";

const UserAPIRouter = express.Router();

UserAPIRouter.get("/v1/getUserDetails/", (request, response) => {
  const userController = new UserController(response);
  userController.getUserDetails(request);
});

export default UserAPIRouter;