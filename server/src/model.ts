import mongoose, { Schema } from "mongoose";
const donationSchema = new Schema({
  place: { type: String, required: true },
  amount:{type:Number,required:true},
  date:{type:Date,required:true}
});
export const Donation=mongoose.model('Donation',donationSchema)