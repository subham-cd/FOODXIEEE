import orderModel from "../models/orderModel.js";
import userModel from "../models/userModel.js";
import Stripe from "stripe";
import dotenv from 'dotenv';
dotenv.config(); // ✅ This loads the .env variables


const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

//placing user order for backend
const placeorder = async (req, res) => {
    const frontend_url = "https://foodxieee-frontend.onrender.com"
  try {
    const newOrder = new orderModel({
      userId:req.user.id,
      items: req.body.items,
      amount: req.body.amount,
      address: req.body.address,
    });

    await newOrder.save();
    await userModel.findByIdAndUpdate(req.user.id, { cartData: {} });

    const line_items = req.body.items.map((item)=>({
        price_data:{
            currency:"inr",
            product_data:{
                name:item.name
            },
            unit_amount:item.price*100*80
        },
        quantity:item.quantity

    }))
    line_items.push({
        price_data:{
            currency:"inr",
            product_data:{
                name:"Delivery Charges"
            },
            unit_amount:2*100*80
        },
        quantity:1
    })
    const session = await stripe.checkout.sessions.create({
        line_items:line_items,
        mode:'payment',
        success_url:`${frontend_url}/verify?success=true&orderId=${newOrder._id}`,
        cancel_url:`${frontend_url}/verify?success=false&orderId=${newOrder._id}`

    })
    res.json({
        success:true,
        session_url:session.url
    })
  } catch (error) {
     console.log(error),
     res.json({
        success:false,
        message:"Error"
     })
  }
};

const verifyOrder = async (req,res)=>{
   const {orderId,success} = req.body;
   try {
    if(success =="true"){
        await orderModel.findByIdAndUpdate(orderId,{payment:true});
          res.json({ success: true, message: "Paid" })
    }
    else {
        await orderModel.findByIdAndDelete(orderId);
        res.json({success:false,message:"Not Paid"})
    }
    
   } catch (error) {
    console.log(error);
    res.json({success:false,message:"Error"})
   }
}
// userorder for frontend
const userOrders = async (req,res)=>{
    try {
         const userId = req.user.id;
       const orders = await orderModel.find({userId});
       res.json({success:true,
        data:orders
       })  
    } catch (error) {
        console.log(error);
        res.json({success:false,message:"Error"})
    }
   
}
//listing order for admin panel
const listOrders = async (req,res)=>{
   try {
    const orders = await orderModel.find({});
    res.json({success:true,data:orders})
   } catch (error) {
    console.log(error);
     res.json({success:false,message:"Error"});
   }
}
//api for updating order status
const updateStatus = async(req,res)=>{
     try {
        await orderModel.findByIdAndUpdate(req.body.orderId,{status:req.body.status});
        res.json({success:true,message:"Status updated"})
     } catch (error) {
        console.log(error);
        res.json({
            success:false,
            message:"Error"
        })
     }
}
export { placeorder,verifyOrder,userOrders ,listOrders,updateStatus};
