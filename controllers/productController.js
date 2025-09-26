import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Product from "../models/product.js"
import Order from "../models/order.js"
import APIFilters from "../utils/apiFilters.js";
import ErrorHandler from "../utils/errorHandler.js";
import { delete_file, upload_file } from "../utils/cloudinary.js";

export const getAllProducts = catchAsyncErrors(async (req,res,next)=>{
    const resPerPage = 8;
    const apiFilters = new APIFilters(Product,req.query).search().filters();
    let products = await apiFilters.query;
    let filteredProductsCount = products.length;
    apiFilters.pagination(resPerPage);
    products = await apiFilters.query.clone();
    res.status(200).json({resPerPage,filteredProductsCount,products});
})
export const newProduct = catchAsyncErrors(async (req,res)=>{
    req.body.user = req.user._id; // Assuming req.user is set by isAuthenticatedUser middleware
    const product = await Product.create(req.body);
    res.status(201).json(product);
})
export const getProductDetails = catchAsyncErrors(async (req,res,next)=>{

    const product = await Product.findById(req?.params?.id).populate('reviews.user');
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json(product);
})
export const updateProduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req?.params?.id);
    if(!product){
       return next(new ErrorHandler("Product not found", 404));
    }
    const updatedProduct = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,  });
    res.status(200).json(updatedProduct);
})

export const uploadProductImages = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req?.params?.id);
    if(!product){
       return next(new ErrorHandler("Product not found", 404));
    }
  const uploader = async (image)=> upload_file(image,"shopit/products")
  const urls = await Promise.all((req?.body?.images).map(uploader))
  product?.images?.push(...urls)
  await product.save();
    res.status(200).json(product);
})
export const deleteProductImages = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req?.params?.id);
    if(!product){
       return next(new ErrorHandler("Product not found", 404));
    }
  const isDeleted = await delete_file(req?.body?.imgId)
if(isDeleted){
    product.images =  product.images.filter(
        img => img.public_id != req?.body?.imgId
    )
}
  await product.save();
    res.status(200).json(product);
})
export const deleteProduct = catchAsyncErrors(async (req,res,next)=>{
    const product = await Product.findById(req?.params?.id);
    if(!product){
       return next(new ErrorHandler("Product not found", 404));
    }
      // Deleting images associated with the product
    for (let i = 0; i < product.images.length; i++) {
        const result = await delete_file(product.images[i].public_id)
    }

    await product.deleteOne();
   res.status(200).json({
        success: true,
        message: 'Product is deleted.'
    })
})
// create & update product review
export const createProductReview = catchAsyncErrors(async (req,res,next)=>{
    const { rating,comment,productId } = req.body;
    const review = {
        user : req?.user?._id,
        rating:Number(rating),
        comment
    }
    const product = await Product.findById(productId);
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    const isReviewed = product?.reviews?.find((rev)=>rev?.user?.toString() === req.user._id.toString());
    if(isReviewed){
        product.reviews.forEach((review)=>{
            if(review?.user?.toString() === req?.user?._id.toString()){
                review.rating = rating;
                review.comment = comment;
            }
        })
    }else{
        product.reviews.push(review);
        product.numOfReviews = product.reviews.length;
    }
    product.ratings = product.reviews.reduce((acc,item)=>item.rating + acc,0) / product.reviews.length;
    await product.save({validateBeforeSave: false});
    res.status(200).json({
        success: true,
        message: "Review added or updated successfully"
    });
})

export const getProductReviews = catchAsyncErrors(async (req,res,next)=>{
    const product  =  await Product.findById(req?.query?.id).populate('reviews.user');
    if(!product){
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success: true,
        reviews: product.reviews
    });
})

export const getAdminProducts = catchAsyncErrors(async (req,res,next)=>{

    const products = await Product.find();
    
    res.status(200).json({products});
})
// Admin Delete Review
export const deleteProductReview = catchAsyncErrors(async (req, res, next) => {
    const { productId, id } = req.query; // ✅ Read from query parameters

    if (!productId || !id) {
        return next(new ErrorHandler("Product ID and Review ID are required", 400));
    }

    let product = await Product.findById(productId);

    if (!product) {
        return next(new ErrorHandler("Product not found", 404));
    }

    // Filter reviews
    const reviews = product.reviews.filter(
        (rev) => rev._id.toString() !== id.toString()
    );

    const numOfReviews = reviews.length;
    const ratings =
        numOfReviews === 0
            ? 0
            : reviews.reduce((acc, item) => item.rating + acc, 0) / numOfReviews;

    // Update product
    product = await Product.findByIdAndUpdate(
        productId,
        { reviews, numOfReviews, ratings },
        { new: true }
    );

    res.status(200).json({
        success: true,
        product
    });
});

export const canUserReview = catchAsyncErrors(async (req,res,next)=>{
   const orders = await Order.find({
    user:req?.user?._id,
    "orderItems.product":req?.query?.productId
   })
   if(orders.length === 0){
    return res.status(200).json({canReview:false})
   }
   return res.status(200).json({canReview:true});
})

