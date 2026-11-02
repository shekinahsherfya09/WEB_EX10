// EXPERIMENT 10: CRAFTY CORNER
// WORKING WITH MONGODB USING SHELL COMMANDS
// 1. DATABASE AND COLLECTION MANAGEMENT
//show dbs;
//use craftyCornerDB;
db;
if(!db.getCollectionNames().includes("products")) db.createCollection("products");
if(!db.getCollectionNames().includes("customers")) db.createCollection("customers");
if(!db.getCollectionNames().includes("orders")) db.createCollection("orders");
//show collections;
// 2. CREATE OPERATIONS
// Insert one craft product
db.products.insertOne({
    productId:101,
    name:"Handmade Greeting Card",
    category:"Paper Craft",
    price:100,
    stock:20,
    rating:4.5,
    materials:["Paper","Colors","Glue"],
    addedDate:new Date("2026-10-01")
});
// Insert multiple craft products
db.products.insertMany([
    {
        productId:102,
        name:"Decorative Candle",
        category:"Home Decor",
        price:250,
        stock:15,
        rating:4.7,
        materials:["Wax","Fragrance","Wick"],
        addedDate:new Date("2026-10-02")
    },
    {
        productId:103,
        name:"Woolen Art",
        category:"Handmade Art",
        price:350,
        stock:12,
        rating:4.8,
        materials:["Wool","Needle"],
        addedDate:new Date("2026-10-03")
    },
    {
        productId:104,
        name:"Flower Vase",
        category:"Home Decor",
        price:400,
        stock:10,
        rating:4.6,
        materials:["Clay","Paint"],
        addedDate:new Date("2026-10-04")
    }
]);
// 3. READ OPERATIONS
// Display all products
db.products.find();
// Find products by category
db.products.find({category:"Paper Craft"});
// Find products with price greater than or equal to 200
db.products.find({price:{$gte:200}});
// Find products with price less than 400
db.products.find({price:{$lt:400}});
// Find Home Decor products OR products priced above 300
db.products.find({
    $or:[
        {category:"Home Decor"},
        {price:{$gt:300}}
    ]
});
// Find products made using Paper
db.products.find({materials:"Paper"});
// Display selected fields
db.products.find(
    {},
    {name:1,price:1,category:1,_id:0}
);
// Find one product
db.products.findOne({productId:101});
// Count Home Decor products
db.products.countDocuments({category:"Home Decor"});
// 4. UPDATE OPERATIONS
// Update one product
db.products.updateOne(
    {productId:101},
    {$set:{price:120,stock:25}}
);
// Add a material to Paper Craft products
db.products.updateMany(
    {category:"Paper Craft"},
    {$push:{materials:"Decorative Ribbon"}}
);
// Increase stock by 5
db.products.updateOne(
    {productId:102},
    {$inc:{stock:5}}
);
// 5. INDEXING
// Create unique index
db.products.createIndex(
    {productId:1},
    {unique:true}
);
// Display indexes
db.products.getIndexes();
// 6. DELETE OPERATIONS
// Delete one product
db.products.deleteOne({productId:103});
// Delete products with price below 150
db.products.deleteMany({price:{$lt:150}});
// Drop collection (execute separately if required)
// db.products.drop();
// Drop database (execute separately if required)
// db.dropDatabase();
