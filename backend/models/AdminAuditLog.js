import mongoose,{Schema} from 'mongoose';
import {getDbState,readLocalFile,writeLocalFile} from '../config/db.js';
const S=new Schema({actorId:String,actorEmail:String,actorRole:String,action:String,targetType:String,targetId:String,description:String,createdAt:{type:Date,default:Date.now}});
const M=mongoose.models.AdminAuditLog||mongoose.model('AdminAuditLog',S);
export const AuditRepo={create:async d=>getDbState()?M.create(d):local(d),find:async()=>getDbState()?M.find().sort({createdAt:-1}).limit(500):readLocalFile('adminAuditLogs.json').sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt))};
function local(d){const a=readLocalFile('adminAuditLogs.json');const x={...d,_id:`audit_${Date.now()}`,createdAt:new Date()};a.push(x);writeLocalFile('adminAuditLogs.json',a);return x}
