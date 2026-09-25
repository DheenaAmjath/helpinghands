import mongoose from 'mongoose'
const userSchema = new mongoose.Schema({
  name:{type:String,required:true,trim:true,minlength:2,maxlength:80},
  email:{type:String,required:true,unique:true,lowercase:true,trim:true},
  password:{type:String,required:true,select:false},
  role:{type:String,enum:['donor','requester','community','admin'],default:'donor'},
  location:{type:String,trim:true,maxlength:100},
  bio:{type:String,trim:true,maxlength:500},
  notificationsEnabled:{type:Boolean,default:true},
  active:{type:Boolean,default:true},
},{timestamps:true})
export default mongoose.model('User', userSchema)
