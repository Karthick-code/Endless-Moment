import {AvailabilityRepo} from '../models/Availability.js';
export const listAvailability=async(req,res)=>{try{res.json(await AvailabilityRepo.find())}catch(e){res.status(500).json({msg:e.message})}};
export const createAvailability=async(req,res)=>{try{if(!req.body.date)return res.status(400).json({msg:'Date is required.'});res.status(201).json(await AvailabilityRepo.create({...req.body,createdBy:req.user.email}))}catch(e){res.status(400).json({msg:e.message})}};
export const deleteAvailability=async(req,res)=>{try{const x=await AvailabilityRepo.remove(req.params.id);if(!x)return res.status(404).json({msg:'Availability record not found.'});res.json(x)}catch(e){res.status(500).json({msg:e.message})}};
