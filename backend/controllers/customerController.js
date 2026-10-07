import {CustomerRepo} from '../models/Customer.js';
export const getCustomers=async(req,res)=>{try{res.json(await CustomerRepo.find())}catch(e){res.status(500).json({msg:e.message})}};
export const createCustomer=async(req,res)=>{try{const {name,email,phone}=req.body;if(!name||!email||!phone)return res.status(400).json({msg:'Name, email and phone are required.'});res.status(201).json(await CustomerRepo.create(req.body))}catch(e){res.status(400).json({msg:e.message})}};
export const updateCustomer=async(req,res)=>{try{const x=await CustomerRepo.update(req.params.id,req.body);if(!x)return res.status(404).json({msg:'Customer not found.'});res.json(x)}catch(e){res.status(400).json({msg:e.message})}};
export const deleteCustomer=async(req,res)=>{try{const x=await CustomerRepo.remove(req.params.id);if(!x)return res.status(404).json({msg:'Customer not found.'});res.json(x)}catch(e){res.status(500).json({msg:e.message})}};
