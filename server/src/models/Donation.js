import mongoose from 'mongoose'

const donationSchema = new mongoose.Schema({
  itemName:{type:String,required:true,trim:true,maxlength:120},
  description:{type:String,trim:true,maxlength:1000},
  category:{type:String,required:true,trim:true,maxlength:60},
  condition:{type:String,enum:['New','Like New','Good','Used but Usable'],required:true},
  quantity:{type:Number,required:true,min:1,max:10000},
  location:{type:String,required:true,trim:true,maxlength:100},
  status:{type:String,enum:['Available','Offered','Matched','Coordinating','Completed','Cancelled','Declined'],default:'Offered'},
  donor:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  need:{type:mongoose.Schema.Types.ObjectId,ref:'Need'},
  handoverNotes:{type:String,trim:true,maxlength:1000},
},{timestamps:true})
export default mongoose.model('Donation', donationSchema)
