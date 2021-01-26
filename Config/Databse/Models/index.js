import mongoose from "mongoose";

import User from "./user";
import TwilioVerifyUser from "./twilio_verify";

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
  });
} 

const models = { User, TwilioVerifyUser };
export { connectDb };
export default models;