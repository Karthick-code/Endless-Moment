import {BookingRepo} from '../models/Booking.js';
import {CustomerRepo} from '../models/Customer.js';
import {ServiceRepo} from '../models/Service.js';
import {AuditRepo} from '../models/AdminAuditLog.js';
import {notifyNewEnquiry} from '../services/notifications/index.js';
const statuses=['REQUESTED','UNDER_REVIEW','CONFLICT_REQUEST','QUOTED','CUSTOMER_CONFIRMATION','CONFIRMED','COMPLETED','CANCELLED','REJECTED'];
const conflictStatuses=['REQUESTED','UNDER_REVIEW','CONFLICT_REQUEST','QUOTED','CUSTOMER_CONFIRMATION','CONFIRMED'];
export const createBooking=async(req,res)=>{try{
 const {customer,service,subService,subServices=[],package:pkg,selections=[],addOns=[],event}=req.body;
 const selectedSubServices = Array.isArray(subServices) && subServices.length
   ? subServices
   : (subService ? [subService] : []);
 if(!customer?.name||!customer?.email||!customer?.phone||!service?.name||!event?.date||!selectedSubServices.length){return res.status(400).json({msg:'Name, email, phone, category, at least one service and preferred date are required.'})}
 const sameDay=await BookingRepo.find({});
 const active=sameDay.filter(b=>['REQUESTED','UNDER_REVIEW','CONFLICT_REQUEST','QUOTED','CUSTOMER_CONFIRMATION','CONFIRMED'].includes(b.status)&&b.event?.date===event.date);
 const conflict=active.some(b=>timesOverlap(b.event?.startTime,b.event?.endTime,event.startTime,event.endTime));
 const status=conflict?'CONFLICT_REQUEST':'REQUESTED';
 const timeline=[{action:'BOOKING_CREATED',description:conflict?'Request created for an occupied/overlapping slot.':'Booking request received.',performedBy:'customer',newStatus:status}];
 const booking=await BookingRepo.create({customer,service,subService:selectedSubServices[0],subServices:selectedSubServices,package:pkg,selections,addOns,event,status,conflict,timeline});
 const existing=await CustomerRepo.find();const found=existing.find(c=>c.email===customer.email||c.phone===customer.phone);if(!found)await CustomerRepo.create(customer);
 notifyNewEnquiry({name:customer.name,email:customer.email,phone:customer.phone,message:`New booking ${booking.bookingId}: ${service.name} / ${selectedSubServices.map(item=>item.name).join(', ')}`}).catch(()=>{});
 res.status(201).json(booking);
}catch(e){res.status(500).json({msg:'Could not create booking.',error:e.message})}};
function timesOverlap(a,b,c,d){if(!a||!c)return true;const toMin=x=>{const [h,m]=x.split(':').map(Number);return h*60+m};const A=toMin(a),B=toMin(b||a),C=toMin(c),D=toMin(d||c);return A<D&&C<B}
export const getBookings=async(req,res)=>{try{res.json(await BookingRepo.find())}catch(e){res.status(500).json({msg:e.message})}};
export const updateBooking=async(req,res)=>{try{const current=await BookingRepo.findById(req.params.id);if(!current)return res.status(404).json({msg:'Booking not found.'});const next=req.body.status||current.status;if(!statuses.includes(next))return res.status(400).json({msg:'Invalid booking status.'});const timeline=current.timeline||[];timeline.push({action:'STATUS_CHANGED',description:req.body.note||`Booking moved from ${current.status} to ${next}.`,performedBy:req.user.email,newStatus:next,previousStatus:current.status});const updated=await BookingRepo.update(req.params.id,{...req.body,status:next,timeline});await AuditRepo.create({actorId:req.user.id,actorEmail:req.user.email,actorRole:req.user.role,action:'UPDATE_BOOKING',targetType:'booking',targetId:updated.bookingId,description:`Updated booking status to ${next}`});res.json(updated)}catch(e){res.status(500).json({msg:e.message})}};
export const getAvailability=async(req,res)=>{try{const bookings=await BookingRepo.find();const active=bookings.filter(b=>conflictStatuses.includes(b.status));res.json({bookings:active.map(b=>({bookingId:b.bookingId,date:b.event?.date,startTime:b.event?.startTime,endTime:b.event?.endTime,status:b.status}))})}catch(e){res.status(500).json({msg:e.message})}};
