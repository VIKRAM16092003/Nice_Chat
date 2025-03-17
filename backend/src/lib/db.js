import mongoose from "mongoose";

export const connectDB= async () => {
    try {
        const conn=await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            maxPoolSize: 10, // Limit MongoDB connections
          });
        console.log("MONGODB connect "+conn.connection.host);
        
    } catch (error) {
        console.log("MONGODB connection error",error);
        
    }
    
};