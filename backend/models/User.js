import mongoose,{Schema} from 'mongoose';
import {getDbState,readLocalFile,writeLocalFile} from '../config/db.js';
const UserSchema=new Schema({email:{type:String,required:true,unique:true},passwordHash:{type:String,required:true},role:{type:String,enum:['master_admin','admin'],default:'admin'},active:{type:Boolean,default:true},createdBy:String,createdAt:{type:Date,default:Date.now},lastLogin:Date});
const MongoUserModel=mongoose.models.User||mongoose.model('User',UserSchema);
export const UserRepo={
 findOne:async q=>getDbState()?MongoUserModel.findOne(q):readLocalFile('users.json').find(u=>Object.entries(q).every(([k,v])=>u[k]===v))||null,
 find:async()=>getDbState()?MongoUserModel.find().select('-passwordHash').sort({createdAt:-1}):readLocalFile('users.json').map(({passwordHash,...u})=>u),
 create:async d=>getDbState()?MongoUserModel.create(d):localCreate(d),
 update:async(id,d)=>getDbState()?MongoUserModel.findByIdAndUpdate(id,{$set:d},{new:true}).select('-passwordHash'):localUpdate(id,d),
 remove:async id=>getDbState()?MongoUserModel.findByIdAndUpdate(id,{active:false},{new:true}).select('-passwordHash'):localUpdate(id,{active:false})
};
function localCreate(d){const a=readLocalFile('users.json');if(a.some(u=>u.email===d.email))throw new Error('A user with this email already exists.');const x={...d,_id:`u_${Date.now()}`,createdAt:new Date()};a.push(x);writeLocalFile('users.json',a);const {passwordHash,...safe}=x;return safe}
function localUpdate(id,d){const a=readLocalFile('users.json');const i=a.findIndex(u=>u._id===id);if(i<0)return null;a[i]={...a[i],...d};writeLocalFile('users.json',a);const {passwordHash,...safe}=a[i];return safe}
export default MongoUserModel;
