import mongoose from "mongoose";    

 export const connectDB = async () => {
    await mongoose.connect('mongodb+srv://fooddel:fooddel123@cluster0.ddt6rmg.mongodb.net/foodixeee').then(()=>console.log("MongoDB connected successfully"))
}