import mongoose,{Schema} from 'mongoose';
import {getDbState,readLocalFile,writeLocalFile} from '../config/db.js';
const S=new Schema({date:String,startTime:String,endTime:String,type:{type:String,default:'BLOCKED'},note:String,createdBy:String,createdAt:{type:Date,default:Date.now}});const M=mongoose.models.Availability||mongoose.model('Availability',S);
export const AvailabilityRepo={find:async()=>getDbState()?M.find().sort({date:1}):readLocalFile('availability.json'),create:async d=>getDbState()?M.create(d):localCreate(d),remove:async id=>getDbState()?M.findByIdAndDelete(id):localRemove(id)};
function localCreate(d){const a=readLocalFile('availability.json');const x={...d,_id:`av_${Date.now()}`,createdAt:new Date()};a.push(x);writeLocalFile('availability.json',a);return x} function localRemove(id){const a=readLocalFile('availability.json');const i=a.findIndex(x=>x._id===id);if(i<0)return null;const x=a.splice(i,1)[0];writeLocalFile('availability.json',a);return x}
