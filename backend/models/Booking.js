import mongoose, { Schema } from 'mongoose';
import { getDbState, readLocalFile, writeLocalFile } from '../config/db.js';

const SelectionSchema = new Schema({ group: String, name: String, value: String }, { _id: false });
const TimelineSchema = new Schema({ action: String, description: String, performedBy: String, timestamp: { type: Date, default: Date.now }, previousStatus: String, newStatus: String }, { _id: false });
const BookingSchema = new Schema({
  bookingId: { type: String, unique: true },
  customer: { name: String, email: String, phone: String, alternatePhone: String },
  service: { serviceId: String, name: String, slug: String },
  subService: { subServiceId: String, name: String },
  package: { packageId: String, name: String },
  selections: [SelectionSchema],
  addOns: [SelectionSchema],
  event: { date: String, alternateDate: String, startTime: String, endTime: String, location: String, city: String, guestCount: String, budget: String, notes: String },
  status: { type: String, default: 'REQUESTED' },
  conflict: { type: Boolean, default: false },
  alternative: { date: String, startTime: String, endTime: String, note: String },
  timeline: [TimelineSchema],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});
const MongoBooking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);
const nextId = (items) => `EM-${new Date().getFullYear()}-${String(items.length + 1).padStart(6,'0')}`;
export const BookingRepo = {
  find: async (query={}) => getDbState() ? MongoBooking.find(query).sort({createdAt:-1}) : readLocalFile('bookings.json').filter(b=>Object.entries(query).every(([k,v])=>b[k]===v)).sort((a,b)=>new Date(b.createdAt)-new Date(a.createdAt)),
  findById: async id => getDbState() ? MongoBooking.findById(id) : readLocalFile('bookings.json').find(b=>b._id===id || b.bookingId===id),
  create: async data => {
    if(getDbState()) { const count=await MongoBooking.countDocuments(); return MongoBooking.create({...data,bookingId:data.bookingId||nextId({length:count}),timeline:data.timeline||[]}); }
    const items=readLocalFile('bookings.json'); const item={...data,_id:`b_${Date.now()}`,bookingId:data.bookingId||nextId(items),createdAt:new Date(),updatedAt:new Date()}; items.push(item); writeLocalFile('bookings.json',items); return item;
  },
  update: async (id, update) => {
    if(getDbState()) return MongoBooking.findByIdAndUpdate(id,{$set:{...update,updatedAt:new Date()}},{new:true});
    const items=readLocalFile('bookings.json'); const i=items.findIndex(b=>b._id===id||b.bookingId===id); if(i<0)return null; items[i]={...items[i],...update,updatedAt:new Date()}; writeLocalFile('bookings.json',items); return items[i];
  }
};
export default MongoBooking;
