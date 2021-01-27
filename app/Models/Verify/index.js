import models from "./../../../Config/Databse/Models"

const { User, TwilioVerifyUser } = models;
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

export default class VerifyModel {
  async preRegistration(args) {
    try {
      return new Promise((resolve, reject) => {
        TwilioVerifyUser.findOne({ 
          phone_number: args.phone_number 
        }).exec((error, user) => {
          if (error) {
            reject(error);
          }
          if (user) {
            reject({
              message: "User already exists with same phone number, please try again with different phone number!",
              name: "UserExistException"
            });
          } else {
            TwilioVerifyUser.findOne({
              email: args.email
            }).exec((error, user) => {
              if (error) {
                reject(error);
              }
              if (user) {
                reject({
                  message: "User already exists with same email, please try again with different email!",
                  name: "UserExistException"
                });
              } else {
                console.log("HOLA");
                console.log(args.email)
                console.log(args.phone_number)
                client.verify.services(process.env.VERIFY_SERVICE_ID).verifications.create({
                  to: "" + args.phone_number,
                  channel: "sms"
                }).then(verification => {
                  console.log("YO YO");
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
                        return;
                      }
                    });
                  }
                });
              }
            })
          }
        })
      });
    } catch (error) {
      return error;
    }
  }

  async verifyPreRegistration(args) {
    try {
      return new Promise((resolve, reject) => {
        client.verify.services(process.env.VERIFY_SERVICE_ID).verificationChecks.create({
          to: args.phone_number,
          code: args.otp
        }).then(verification => {
          if (verification.status === "approved") {
            resolve({
              message: "Verification Successfull!",
              phone_number: args.phone_number
            });
          }
          reject({
            message: "Incorrect OTP, please try again.",
            name: "InvalidOTP"
          });
        });
      });
    } catch (error) {
      return error;
    }
  }
}