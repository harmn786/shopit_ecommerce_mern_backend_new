import mongoose from "mongoose";
import products from "./productDataSeeder.js";
import Product from "../models/product.js";

const seedProducts = async () => {
  try {
    // await mongoose.connect("mongodb://localhost:27017/shopit_ecommerce");
   await mongoose.connect("mongodb+srv://shopit_db_user:Abdul%40786@shopit.dblmli4.mongodb.net/shopit?retryWrites=true&w=majority&appName=shopit");

    await Product.deleteMany();
    console.log("Products are deleted");

    await Product.insertMany(products);
    console.log("Products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProducts();