import { Request, Response } from "express";
import { Donation } from "./model";
export const addAmount=async(req:Request,res:Response)=>{
    const{place,amount,date}=req.body
    if (!place||!amount||!date) {
        throw new Error()
    }
    const addAmount=new Donation({
        place,amount,date
    })
    const saveAmount=await addAmount.save()
    try {
        res.send({ok:true,content:saveAmount})
    } catch (error) {
        res.send({ok:false,error:'Failed to add amount'})
    }

}
export const donations=async(req:Request,res:Response)=>{
    const getDonations=await Donation.find()
    try {
        res.send(getDonations)
    } catch (error) {
        res.send(Error)
    }
}