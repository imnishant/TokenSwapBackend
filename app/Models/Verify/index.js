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
                console.log(typeof args.email);
                console.log(TwilioVerifyUser);
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

  async preRegistration(args) {
    try {

    } catch (error) {
      return error;
    }
  }
}