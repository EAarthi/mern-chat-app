import mongoose from "mongoose";

const connectToMongoDB = async () => {
    try{
        await mongoose.connect(process.env.MONGO_DB_URI);
        console.log("Connected to MongoDB successfully.")
    } catch(error){
        console.log("Error Connecting to The MongoDB,",error.message);
    }
}

export default connectToMongoDB;//mongo db connectivity