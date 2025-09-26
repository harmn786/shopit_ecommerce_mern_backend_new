import mongoose from "mongoose";
export const connectDb=()=>{
    const NODE_ENV = process.env.NODE_ENV
    let DB_URI = ""
    DB_URI = NODE_ENV === 'Development' ? process.env.DB_LOCAL_URI : process.env.DB_URI;
    mongoose.connect(DB_URI).then((conn)=>{
        console.log(`Database connected successfully in ${NODE_ENV} mode on host: ${conn.connection.host} and port: ${conn.connection.port}`);
    })
}
