import mongoose from "mongoose"

const ConnectDB =async()=>{
    if(!process.env.DATABASE_URL){
        throw new Error("Database url not found")
    }
    const db = await mongoose.connect(process.env.DATABASE_URL)
    console.log(`Connected to database: ${db.connection.name}`)
}

export default ConnectDB;