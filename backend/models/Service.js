import mongoose, { Schema } from 'mongoose';
import { getDbState, readLocalFile, writeLocalFile } from '../config/db.js';
const OptionSchema=new Schema({name:String,type:{type:String,default:'checkbox'},active:{type:Boolean,default:true},displayOrder:{type:Number,default:0}},{_id:true});
const SubSchema=new Schema({name:String,description:String,active:{type:Boolean,default:true},displayOrder:{type:Number,default:0},optionGroups:[{name:String,type:{type:String,default:'multi-select'},options:[OptionSchema]}]},{_id:true});
const PackageSchema=new Schema({name:String,description:String,price:String,active:{type:Boolean,default:true},displayOrder:{type:Number,default:0}},{_id:true});
const ServiceSchema=new Schema({name:String,slug:{type:String,index:true},description:String,active:{type:Boolean,default:true},displayOrder:{type:Number,default:0},subServices:[SubSchema],packages:[PackageSchema],addOns:[OptionSchema],createdAt:{type:Date,default:Date.now},updatedAt:{type:Date,default:Date.now}});
const MongoService=mongoose.models.BookingService||mongoose.model('BookingService',ServiceSchema);
export const ServiceRepo={
 find:async()=>getDbState()?MongoService.find().sort({displayOrder:1,name:1}):readLocalFile('services.json'),
 findById:async id=>getDbState()?MongoService.findById(id):readLocalFile('services.json').find(s=>s._id===id),
 create:async d=>getDbState()?MongoService.create(d):localCreate(d),
 update:async(id,d)=>getDbState()?MongoService.findByIdAndUpdate(id,{$set:{...d,updatedAt:new Date()}},{new:true}):localUpdate(id,d),
 delete:async id=>getDbState()?MongoService.findByIdAndDelete(id):localDelete(id)
};
function localCreate(d){const a=readLocalFile('services.json');const x={...d,_id:`s_${Date.now()}`,createdAt:new Date(),updatedAt:new Date()};a.push(x);writeLocalFile('services.json',a);return x}
function localUpdate(id,d){const a=readLocalFile('services.json');const i=a.findIndex(x=>x._id===id);if(i<0)return null;a[i]={...a[i],...d,updatedAt:new Date()};writeLocalFile('services.json',a);return a[i]}
function localDelete(id){const a=readLocalFile('services.json');const i=a.findIndex(x=>x._id===id);if(i<0)return null;const x=a.splice(i,1)[0];writeLocalFile('services.json',a);return x}
export default MongoService;
