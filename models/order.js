import mongoose from 'mongoose'
import Product from '../models/product.js'
import User from '../models/User.js'
const OrderSchema = mongoose.Schema({
    shippingInfo: {
        address: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        phoneNo: {
            type: String,
            required: true
        },
        zipCode: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    orderItems: [
        {
            name: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                default: 1

            },
            image: {
                type: String,
                required: true
            },
            price: {
                type: Number,
                required: true
            },
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            }
        }
    ],
    paymentMethod: {
        type: String,
        required: [true, "Please select a payment method"],
        enum: {
            values: ["cod", "card"],
            message: "Please select a correct payment method"
        }

    },
    paymentInfo: {
        id: {
            type: String,
        },
        status: {
            type: String,
        }
    },
    itemsPrice: {
        type: Number,
        required: true,
    },
    taxAmount: {
        type: Number,
        required: true,
    },
    shippingAmount: {
        type: Number,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
    },
    orderStatus: {
        type: String,
        default: "Processing",
        enum: {
            values: [
                "Processing",
                "Shipped",
                "Delivered",
                "Cancelled"
            ],
            message: "Please select correct status for order"
        }
    },
    deliveredAt: {
        type: Date,
    },

}, { timestamps: true })

export default mongoose.model("Order",OrderSchema)