const mongoose=require("mongoose");
// Connect to MongoDB
async function connectDB(){
    try{
        await mongoose.connect("mongodb://127.0.0.1:27017/craftyCornerDB");
        console.log("MongoDB Connected Successfully");
    }catch(error){
        console.log("MongoDB Connection Error:",error.message);
        process.exit(1);
    }
}
// Product Schema
const productSchema=new mongoose.Schema({
    productId:{type:Number,required:true,unique:true},
    name:String,
    description:String,
    category:String,
    price:Number,
    stock:Number,
    image:String,
    materials:[String]
});
// Cart Schema
const cartSchema=new mongoose.Schema({
    productId:Number,
    name:String,
    price:Number,
    quantity:{type:Number,default:1}
});
// Customer Schema
const customerSchema=new mongoose.Schema({
    customerId:Number,
    name:String,
    email:String,
    phone:String
});
// Order Schema
const orderSchema=new mongoose.Schema({
    orderId:Number,
    items:[mongoose.Schema.Types.Mixed],
    total:Number,
    orderDate:{type:Date,default:Date.now}
});
// Create MongoDB Models
const Product=mongoose.model("Product",productSchema);
const Cart=mongoose.model("Cart",cartSchema);
const Customer=mongoose.model("Customer",customerSchema);
const Order=mongoose.model("Order",orderSchema);
// Export models and connection
module.exports={connectDB,Product,Cart,Customer,Order};