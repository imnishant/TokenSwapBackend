import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema(
  {
    email: { type: String, required: true, unique: true },
    full_name: { type: String, required: true },
    wallet_address_counter: { type: Number, required: true }
  },
  { timestamps: true }
);

const User = mongoose.model("User", UserSchema);
export default User;