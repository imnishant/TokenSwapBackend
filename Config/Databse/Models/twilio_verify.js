import mongoose, { Schema } from "mongoose";

const TwilioVerifySchema = new Schema({
  email: { type: String, required: true },
  phone_number: { type: String, required: true }
});

const TwilioVerifyUser = mongoose.model("twilio_verify_user", TwilioVerifySchema);

export default TwilioVerifyUser;