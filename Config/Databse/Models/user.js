import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    full_name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone_number: { type: String, required: true },
    wallet_address_counter: { type: Number, required: true },
    wallet_address: { type: String, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;