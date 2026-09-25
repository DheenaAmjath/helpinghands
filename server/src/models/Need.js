import mongoose from 'mongoose'

const supportingProofSchema = new mongoose.Schema({
  originalName:{type:String,required:true,trim:true,maxlength:180},
  storageKey:{type:String,required:true},
  mimeType:{type:String,enum:['application/pdf','image/jpeg','image/png'],required:true},
  size:{type:Number,required:true,min:1,max:5*1024*1024},
  uploadedAt:{type:Date,default:Date.now},
})

const needSchema = new mongoose.Schema({
  title:{type:String,required:true,trim:true,maxlength:120},
  description:{type:String,required:true,trim:true,maxlength:1500},
  category:{type:String,required:true,trim:true,maxlength:60},
  location:{type:String,required:true,trim:true,maxlength:100},
  urgency:{type:String,enum:['Low','Medium','High','Critical'],default:'Medium'},
  quantityNeeded:{type:Number,required:true,min:1,max:10000},
  quantityFulfilled:{type:Number,default:0,min:0},
  verificationStatus:{type:String,enum:['Pending Verification','Under Review','Verified','Rejected','Fulfilled','Cancelled'],default:'Pending Verification'},
  submittedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User',required:true},
  reviewedBy:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
  reviewerNotes:{type:String,trim:true,maxlength:1000},
  reviewedAt:Date,
  supportingProofs:{type:[supportingProofSchema],default:[]},
},{timestamps:true})
export default mongoose.model('Need', needSchema)
