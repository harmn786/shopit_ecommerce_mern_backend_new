import mongoose from "mongoose";
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter a Product Name"],
        maxLength: [200, "Product Name cann't exceed 200 characters"]
    },
    price: {
        type: Number,
        required: [true, "Please enter Proiduct Price"],
        max: [999999, "Product Price cann't exceed 6 digits"]
    },
    description: {
        type: String,
        required: [true, "Please enter Product Description"],
    },
    ratings: {
        type: Number,
        default: 0
    },
    images: [{
        public_id: {
            type: String,
            required: true
        },
        url: {
            type: String,
            required: true
        }
    }],
    category: {
        type: String,
        required: [true, "Please enter Product Category"],
        maxLength: [200, "Product Name cann't exceed 200 characters"],
        enum: {
            values: [
                "Electronics",
                "Cameras",
                "Laptops",
                "Accessories",
                "Headphones",
                "Food",
                "Books",
                "Clothes/Shoes",
                "Beauty/Health",
                "Sports",
                "Outdoor"
            ],
            message: "Please select correct category for Product"
        }
    },
    seller: {
        type: String,
        required: [true, "Please enter Product Seller"],
    },
    stock: {
        type: Number,
        required: [true, "Please Enter Product Stock"]
    },
    numOfReviews: {
        type: Number,
        default: 0,
    },
    reviews: [{
        user: {
            type: mongoose.Schema.ObjectId,
            ref: "User",
            required: true
        },
        rating: {
            type: Number,
            required: true,
        },
        comment: {
            type: String,
            required: true,
        }
    }],
    user: {
        type: mongoose.Schema.ObjectId,
        ref: "User",
        required: false
    },
   status: {
    type: Number,
    enum: [0, 1],
    default: 0,
}
},{timestamps:true})
export default mongoose.model("Product",productSchema);
