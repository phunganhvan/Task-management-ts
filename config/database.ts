import mongoose from 'mongoose';

// const pathMongo = process.env.MONGO_URL;
//import mongoose
//mongodb://localhost:27017/product-management
export const connect =  async() : Promise<void>=> {
    try{
        await mongoose.connect(process.env.MONGO_URL!);
        console.log("Connected to MongoDB successfully");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}