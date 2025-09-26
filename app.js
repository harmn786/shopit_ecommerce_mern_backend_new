import express from 'express'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/order.js'
import paymentRoutes from './routes/payment.js'
if(process.env.NODE_ENV !== "production"){
  dotenv.config({path: './config/config.env'})
}
import { connectDb } from './config/dbConnect.js'
import errorMiddlewre from './middlewares/errors.js'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

process.on("uncaughtException", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to uncaught exception");
    process.exit(1);
})
connectDb()

const app = express()

app.use(cors());
app.use(express.json({limit:"10mb"}))
app.use(express.urlencoded({ extended: true })); // ✅ For form-data
app.use(cookieParser())
app.use("/api/v1", productRoutes)
app.use("/api/v1", authRoutes)
app.use("/api/v1", orderRoutes)
app.use("/api/v1", paymentRoutes)

// Serve React frontend in production

// if (process.env.NODE_ENV === "production") {
//   const buildPath = path.join(__dirname, "../frontend/build");
//   app.use(express.static(buildPath));
//    console.log(`Serving static files from: ${buildPath}`);

//   app.get(/(.*)/, (req, res) => {
//     res.sendFile(path.join(buildPath, "index.html"));
//   });
// }
app.use(errorMiddlewre)
const PORT = process.env.PORT || 3000
const Mode = process.env.NODE_ENV || "Development"
const server  = app.listen(PORT,()=>{
    console.log(`Server is running on the port ...${PORT} in ${Mode} mode`)
})

process.on("unhandledRejection", (err)=>{
    console.log(`Error: ${err.message}`);
    console.log("Shutting down the server due to unhandled promise rejection");
    server.close(()=>{
        process.exit(1);
    })
})
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log("Shutting down due to uncaught exception");
  process.exit(1);
});
