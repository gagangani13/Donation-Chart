import { Request, Response } from "express";
import { Donation } from "./model";
export const addAmount=async(req:Request,res:Response)=>{
    const{place,amount}=req.body
    const addAmount=new Donation({
        place,amount
    })
    const saveAmount=await addAmount.save()
    try {
        res.send(saveAmount)
    } catch (error) {
        res.send(Error)
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