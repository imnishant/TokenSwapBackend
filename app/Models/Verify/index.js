const fs = require("fs");
const { EthHdWallet } = require('eth-hd-wallet');
import models from "./../../../Config/Databse/Models";
import { request } from "express";
import { resolve } from "path";

const { User, TwilioVerifyUser } = models;
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default class VerifyModel {
  async preRegistration(args) {
    try {
      return new Promise((resolve, reject) => {
        if (args.email && args.phone_number) {
          TwilioVerifyUser.findOne({ 
            phone_number: args.phone_number 
          }).exec((error, user) => {
            if (error) {
              reject({
                message: "DB Exception. Issue in connecting to DB.",
                name: "DBException"
              });
              return;
            }
            if (user) {
              reject({
                message: "User already exists with same phone number, please try again with different phone number!",
                name: "UserExistException"
              });
              return;
            } else {
              TwilioVerifyUser.findOne({
                email: args.email
              }).exec((error, user) => {
                if (error) {
                  reject({
                    message: "DB Exception. Issue in connecting to DB.",
                    name: "DBException"
                  });
                  return;
                }
                if (user) {
                  reject({
                    message: "User already exists with same email, please try again with different email!",
                    name: "UserExistException"
                  });
                  return;
                } else {
                  client.verify.services(process.env.VERIFY_SERVICE_ID).verifications.create({
                    to: "" + args.phone_number,
                    channel: "sms"
                  }).then(verification => {
                    if (verification.status === "pending") {
                      var new_twilio_user = new TwilioVerifyUser({
                        email: args.email,
                        phone_number: "" + args.phone_number
                      });
                      new_twilio_user.save(error => {
                        if (error) {
                          reject({
                            message: "Can't save Verify details, please check and try again!",
                            name: "TwilioVerifyError"
                          });
                          return;
                        } else {
                          resolve({
                            message: "Please check your mobile for OTP!",
                            email: args.email,
                            phone_number: args.phone_number,
                            twilio_verify_details: verification
                          });
                        }
                      });
                    }
                  });
                }
              })
            }
          })
        } else {
          reject({
            message: "Incorrect parameter. Expected parameters: { email, phone_number }",
            name: "IncorrectParameters"
          });
        }
      });
    } catch (error) {
      return error;
    }
  }

  async verifyPreRegistration(args) {
    try {
      return new Promise((resolve, reject) => {
        if (args.phone_number && args.otp) {
          client.verify.services(process.env.VERIFY_SERVICE_ID).verificationChecks.create({
            to: args.phone_number,
            code: args.otp
          }).then(verification => {
            if (verification.status === "approved") {
              resolve({
                message: "Verification Successfull!",
                phone_number: args.phone_number
              });
              return;
            }
            reject({
              message: "Incorrect OTP, please try again.",
              name: "InvalidOTP"
            });
            return;
          });
        } else {
          reject({
            message: "Incorrect parameter. Expected parameters: { phone_number, otp }",
            name: "IncorrectParameters"
          });
        }
      });
    } catch (error) {
      return error;
    }
  }

  async register(args) {
    try {
      return new Promise((resolve, reject) => {
        if (args.full_name && args.email && args.password) {
          User.findOne({
            email: args.email
          }).exec((error, user) => {
            if (error) {
              reject({
                message: "DB Exception. Issue in connecting to DB.",
                name: "DBException"
              });
              return;
            }
            if (user) {
              reject({
                message: "Email is already taken, please try again with a different email!",
                name: "UserExistException"
              });
              return;
            }
            TwilioVerifyUser.findOne({
              email: args.email
            }).exec((error, user) => {
              if (error) {
                reject({
                  message: "DB Exception. Issue in connecting to DB.",
                  name: "DBException"
                });
                return;
              }
              if (user) {
                try {
                  fs.readFile(__dirname + "/counter.txt", (err, data) => {
                    if (err) {
                      reject({
                        message: "Can't read counter.txt to generate wallet address.",
                        name: "NotFoundException"
                      });
                      return;
                    }
                    let i = parseInt(data.toString());
                    const wallet = EthHdWallet.fromMnemonic(process.env.MNEMONIC);
                    const wallet_address = wallet.generateAddresses(i).slice(-1)[0];
                    let new_user = new User({
                      email: args.email,
                      password: args.password,
                      full_name :args.full_name,
                      phone_number: user.phone_number,
                      wallet_address_counter: i,
                      wallet_address: wallet_address
                    });
                    new_user.save(err => {
                      if (err) {
                        reject({
                          message: "DB Exception. Issue in connecting to DB.",
                          name: "DBException"
                        });
                        return;
                      }
                      i++;
                      fs.writeFile(__dirname + "/counter.txt", i.toString(), "utf8", err => {
                        if (err) {
                          reject({
                            message: "DB Exception. Issue in connecting to DB.",
                            name: "DBException"
                          });
                          return;
                        }
                      });
                      resolve({
                        message: "User successfully registered!",
                        details: new_user,
                        wallet_address: wallet_address
                      });
                      return;
                    });
                  });
                } catch (error) {
                  reject({
                    message: "Unknown exception occured while reading/writing counter.txt",
                    name: "GeneralException"
                  });
                  return;
                }
              } else {
                reject({
                  message: "Please complete step-1 and step-2 of registration first and then try again!",
                  name: "TwilioVerifyError"
                });
                return;
              }
            });
          });
        } else {
          reject({
            message: "Incorrect parameter. Expected parameters: { full_name, email, password }",
            name: "IncorrectParameters"
          });
        }
      });
    } catch(error) {
      return error;
    }
  }

  async login(args) {
    try {
      return new Promise((resolve, reject) => {
        if (args.email && args.password) {
          User.findOne({
            email: args.email
          }).exec((error, user) => {
            if (error) {
              reject({
                message: "DB Exception. Issue in connecting to DB.",
                name: "DBException"
              });
              return;
            }
            if (user) {
              if (user.password == args.password) {
                client.verify.services(process.env.VERIFY_SERVICE_ID).verifications.create({
                  to: "" + user.phone_number,
                  channel: "sms"
                }).then(verification => {
                  if (verification.status === "pending") {
                    resolve({
                      message: "Please check your mobile for OTP!",
                      phone_number: user.phone_number,
                      twilio_verify_details: verification
                    });
                    return;
                  }
                });
              } else {
                reject({
                  message: "Incorrect password, please check once and try again!",
                  name: "ValidationException"
                });
                return;
              }
            } else {
              reject({
                message: "User doesn't exist, please check your email and try again!",
                name: "NotFoundException"
              });
              return;
            }
          });
        } else {
          reject({
            message: "Incorrect parameter. Expected parameters: { email, password }",
            name: "IncorrectParameters"
          });
        }
      });
    } catch (error) {
      return error;
    }
  }

  async verifyLogin(args) {
    try {
      return new Promise((resolve, reject) => {
        if (args.phone_number && args.otp) {
          client.verify.services(process.env.VERIFY_SERVICE_ID).verificationChecks.create({
            to: args.phone_number,
            code: args.otp
          }).then(verification => {
            if (verification.status === "approved") {
              resolve({
                message: "Verification Successfull!",
                phone_number: args.phone_number
              });
              return;
            }
            reject({
              message: "Incorrect OTP, please try again.",
              name: "InvalidOTP"
            });
            return;
          });
        } else {
          reject({
            message: "Incorrect parameter. Expected parameters: { phone_number, otp }",
            name: "IncorrectParameters"
          });
        }
      });
    } catch (error) {
      return error;
    }
  }
}