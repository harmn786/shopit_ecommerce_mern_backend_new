import catchAsyncErrors from "../middlewares/catchAsyncErrors.js";
import Stripe from 'stripe';
import product from "../models/product.js";
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
export const stripeCheckoutSession = catchAsyncErrors( async (req, res, next) => {
    // const body = req?.body;
    // const line_items = body?.orderItems?.map((item) => {
    //     return{
    //          price_data:{
    //             currency:"usd",
    //             product_data:{
    //                 name:item.name,
    //                 images:[item?.image],
    //                 metadata:{productId:item?.product},
    //             },
    //             unit_amount:item?.price * 100,
    //          },
    //           tax_rates:["txr_1S14A2CJTeJbT9VVzosDp96A"],
    //             quantity:item?.quantity,
    //     }
    // })
    // const shipping_rate = body?.itemsPrice > 200 ?"shr_1S143TCJTeJbT9VVFRZgDEtD":"shr_1S142xCJTeJbT9VVFHda9sBR";
    //  const shippingInfo = body?.shippingInfo;
    // const session = await stripe.checkout.sessions.create({
    //     payment_method_types: ['card'],
    //     success_url: `${process.env.FRONTEND_URL}/me/orders?order_success=true`,
    //     cancel_url: `${process.env.FRONTEND_URL}`,
    //     customer_email: req?.user?.email,
    //     client_reference_id: req?.user?._id.toString(),
    //     mode: 'payment',
    //     metadata:{...shippingInfo,itemsPrice:body?.itemsPrice},
    //     shipping_options:[
    //         {
    //             shipping_rate
    //         }
    //     ],
    //     line_items,
    // })
    // res.status(200).json({
    //     url:session.url,
    // })

})