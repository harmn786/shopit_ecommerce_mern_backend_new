import { create } from "domain";
import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Order from "../models/order.js";
import Product from "../models/product.js";
import ErrorHandler from "../utils/errorHandler.js";
export const newOrder = catchAsyncErrors(async (req, res, next) => {
    const { 
        shippingInfo,
        orderItems, 
        paymentMethod, 
        paymentInfo, 
        itemsPrice, 
        taxAmount, 
        shippingAmount, 
        totalAmount 
    } = req.body;
    const order = await Order.create({
          shippingInfo,
        orderItems, 
        paymentMethod, 
        paymentInfo, 
        itemsPrice, 
        taxAmount, 
        shippingAmount, 
        totalAmount,
        user:req.user._id,
    });
    res.status(201).json({
        success: true,
        order
    })
})
export const getOrderDetails = catchAsyncErrors(async (req, res, next) => {
   const order = await Order.findById(req.params.id).populate("user","name email")
   if(!order){
    return next(new ErrorHandler("Order not found with this id you have entered",404))
   }
    res.status(200).json({
        success: true,
        order
    })
})
export const myOrders = catchAsyncErrors(async (req, res, next) => {
   const order = await Order.find({user:req.user._id})
   if(!order){
    return next(new ErrorHandler("Order not found with this id you have entered",404))
   }
    res.status(200).json({
        success: true,
        order
    })
})
// Admin Get All Orders
export const allOrders = catchAsyncErrors(async (req, res, next) => {
   const orders = await Order.find()
    res.status(200).json({
        success: true,
        orders
    })
})
export const updateOrder = catchAsyncErrors(async (req, res, next) => {
   const order = await Order.findById(req.params.id);
   if(!order){
    return next(new ErrorHandler("Order not found with this id you have entered",404))
   }
   if(order.orderStatus === "Delivered"){
    return next(new ErrorHandler("You have already delivered this order",400))
   }
   order?.orderItems?.forEach(async (item)=>{
    const product = await Product.findById(item?.product?.toString());
     if(!product){
    return next(new ErrorHandler("Product not found with this id you have entered",404))
   }
   if(req.body.status === "Shipped"){
        product.stock = product.stock - item.quantity;
    }
    await product.save({validateBeforeSave:false});
   })
   order.orderStatus = req.body.status;
   await order.save()
    res.status(200).json({
        success: true,
        order
    })
})
export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
   const order = await Order.findById(req.params.id);
   if(!order){
    return next(new ErrorHandler("Order not found with this id you have entered",404))
   }
   
   await order.deleteOne()
    res.status(200).json({
        success: true,
    })
})
function getDatesBetween(startDate, endDate) {
    const dates = [];
    const currentDate = new Date(startDate);
    while (currentDate <= new Date(endDate)) {
        const formatedDate = currentDate.toISOString().split('T')[0];
        dates.push(formatedDate);
        currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
}
async function getSalesData(startDate,endDate) {

    const salesData = await Order.aggregate([
        {
            $match: {
                createdAt: { $gte: startDate, $lte: endDate },
                // orderStatus: "Delivered"
            }
        },
        {
            $group: {
                _id: { date:{
                    $dateToString: { format: "%Y-%m-%d", date: "$createdAt"}}
                 },
                 totalSales: { $sum: "$totalAmount" },
                 numOrders:{$sum:1}
            }
        }        
    ]);
    const salesMap = new Map();
    let totalSales = 0;
    let totalNumOrders = 0;
    salesData.forEach((sale) => {
       const date = sale?._id.date;
       const sales = sale?.totalSales;
       const numOrders = sale?.numOrders;
       salesMap.set(date, { sales, numOrders });
       totalSales += sales;
       totalNumOrders += numOrders;
    }
    
)
const dates = getDatesBetween(startDate, endDate)
const finalSalesData = dates.map((date) => ({
    date,
    sales:(salesMap.get(date) ||{sales:0}).sales,
    numOrders:(salesMap.get(date) ||{numOrders:0}).numOrders,
}))

return{salesData:finalSalesData,totalSales,totalNumOrders};
}
export const getSales = catchAsyncErrors(async (req, res, next) => {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    startDate.setUTCHours(0,0,0,0);
    endDate.setUTCHours(23,59,59,999);
    const {salesData,totalSales,totalNumOrders} = await getSalesData(startDate,endDate);
    res.status(200).json({
        totalSales,
        totalNumOrders,
        sale:salesData,
    })
})