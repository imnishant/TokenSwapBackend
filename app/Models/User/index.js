import { response } from "express";
import models from "./../../../Config/Databse/Models";
const { User } = models;

export default class UserModel {
  async getUserDetails(args) {
    try {
      return new Promise((resolve, reject) => {
        if (args.email) {
          User.findOne({
            email: args.email
          }).exec((err, user) => {
            if (err) {
              reject({
                message: "DB Exception. Issue in connecting to DB.",
                name: "DBException"
              });
              return;
            }
            if (user) {
              resolve({
                message: "Successfully found the user!",
                email: args.email,
                full_name: user.full_name,
                phone_number: user.phone_number,
                wallet_address: user.wallet_address
              });
              return;
            }
            reject({
              message: "User not found, please check email and try again.",
              name: "NotFoundException"
            });
            return;
          });
        } else {
          reject({
            message: "Incorrect parameter. Expected parameters: { email }",
            name: "IncorrectParameters"
          });
        }
      });
    } catch (error) {
      return error;
    }
  }
}