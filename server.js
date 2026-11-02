const express=require("express");
const path=require("path");
const {connectDB,Product,Cart,Order}=require("./db");
const app=express();
const PORT=3000;
app.use(express.json());
app.use(express.static(path.join(__dirname,"../public")));
// Start server after connecting to MongoDB
async function startServer(){
    await connectDB();
    // Insert sample products
    const count=await Product.countDocuments();
    if(count===0){
        await Product.insertMany([
            {productId:1,name:"Handmade Greeting Card",description:"Beautiful handmade greeting card",category:"Paper Craft",price:100,stock:20,image:"💌",materials:["Paper","Colors","Glue"]},
            {productId:2,name:"Decorative Candle",description:"Handcrafted scented candle",category:"Home Decor",price:250,stock:15,image:"🕯️",materials:["Wax","Fragrance","Wick"]},
            {productId:3,name:"Woolen Art",description:"Colorful handmade woolen craft",category:"Handmade Art",price:350,stock:12,image:"🧶",materials:["Wool","Needle"]},
            {productId:4,name:"Flower Vase",description:"Decorative handmade flower vase",category:"Home Decor",price:400,stock:10,image:"🏺",materials:["Clay","Paint"]},
            {productId:5,name:"Beaded Bracelet",description:"Beautiful handmade bracelet",category:"Jewellery",price:150,stock:25,image:"📿",materials:["Beads","Thread"]},
            {productId:6,name:"Paper Craft",description:"Creative handmade paper decoration",category:"Paper Craft",price:200,stock:18,image:"🎨",materials:["Paper","Glue","Colors"]}
        ]);
        console.log("Sample products inserted");
    }
    // Home page
    app.get("/",(req,res)=>{
        res.sendFile(path.join(__dirname,"../public/index.html"));
    });
    // Get all products
    app.get("/api/products",async(req,res)=>{
        try{
            const products=await Product.find();
            res.json({
                success:true,
                count:products.length,
                data:products.map(p=>({
                    id:p.productId,
                    name:p.name,
                    description:p.description,
                    category:p.category,
                    price:p.price,
                    stock:p.stock,
                    image:p.image,
                    materials:p.materials
                }))
            });
        }catch(error){
            res.status(500).json({success:false,message:error.message});
        }
    });
    // Get shopping cart
    app.get("/api/cart",async(req,res)=>{
        try{
            const cart=await Cart.find();
            const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
            res.json({
                success:true,
                data:cart.map(item=>({
                    id:item.productId,
                    name:item.name,
                    price:item.price,
                    quantity:item.quantity
                })),
                total:total
            });
        }catch(error){
            res.status(500).json({success:false,message:error.message});
        }
    });
    // Add product to cart
    app.post("/api/cart",async(req,res)=>{
        try{
            const productId=Number(req.body.productId);
            const product=await Product.findOne({productId});
            if(!product){
                return res.status(400).json({success:false,message:"Invalid product"});
            }
            const item=await Cart.findOne({productId});
            if(item){
                if(item.quantity>=product.stock){
                    return res.status(400).json({success:false,message:"Available stock limit reached"});
                }
                item.quantity++;
                await item.save();
            }else{
                if(product.stock<=0){
                    return res.status(400).json({success:false,message:"Product is out of stock"});
                }
                await Cart.create({
                    productId:product.productId,
                    name:product.name,
                    price:product.price,
                    quantity:1
                });
            }
            res.status(201).json({success:true,message:"Product added to cart successfully"});
        }catch(error){
            res.status(500).json({success:false,message:error.message});
        }
    });
    // Remove product from cart
    app.delete("/api/cart/:id",async(req,res)=>{
        try{
            const id=Number(req.params.id);
            const item=await Cart.findOneAndDelete({productId:id});
            if(!item){
                return res.status(404).json({success:false,message:"Cart item not found"});
            }
            res.json({success:true,message:"Product removed from cart"});
        }catch(error){
            res.status(500).json({success:false,message:error.message});
        }
    });
    // Place order
    app.post("/api/orders",async(req,res)=>{
        try{
            const cart=await Cart.find();
            if(cart.length===0){
                return res.status(400).json({success:false,message:"Your shopping cart is empty"});
            }
            // Check product stock
            for(const item of cart){
                const product=await Product.findOne({productId:item.productId});
                if(!product||product.stock<item.quantity){
                    return res.status(400).json({success:false,message:"Insufficient stock for "+item.name});
                }
            }
            const items=cart.map(item=>({
                productId:item.productId,
                name:item.name,
                price:item.price,
                quantity:item.quantity
            }));
            const total=cart.reduce((sum,item)=>sum+item.price*item.quantity,0);
            const order=await Order.create({
                orderId:Date.now(),
                items:items,
                total:total
            });
            // Update product stock
            for(const item of cart){
                await Product.updateOne(
                    {productId:item.productId},
                    {$inc:{stock:-item.quantity}}
                );
            }
            // Clear cart after placing order
            await Cart.deleteMany({});
            res.status(201).json({
                success:true,
                message:"Order placed successfully!",
                data:order
            });
        }catch(error){
            res.status(500).json({success:false,message:error.message});
        }
    });
    // View all orders
    app.get("/api/orders",async(req,res)=>{
        try{
            const orders=await Order.find();
            res.json({success:true,data:orders});
        }catch(error){
            res.status(500).json({success:false,message:error.message});
        }
    });
    // Handle invalid routes
    app.use((req,res)=>{
        res.status(404).json({success:false,message:"Endpoint Not Found"});
    });
    app.listen(PORT,()=>{
        console.log(`Crafty Corner running at http://localhost:${PORT}`);
    });
}
startServer().catch(error=>{
    console.error("Server startup failed:",error);
    process.exit(1);
});