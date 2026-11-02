const productList=document.getElementById("productList");
const cartItems=document.getElementById("cartItems");
const total=document.getElementById("total");
const message=document.getElementById("message");
// Load products from MongoDB
async function loadProducts(){
    try{
        const response=await fetch("/api/products");
        const result=await response.json();
        if(!response.ok) throw new Error(result.message);
        productList.innerHTML="";
        result.data.forEach(product=>{
            const div=document.createElement("div");
            div.className="product";
            const emoji=document.createElement("div");
            emoji.className="emoji";
            emoji.textContent=product.image;
            const name=document.createElement("h3");
            name.textContent=product.name;
            const description=document.createElement("p");
            description.textContent=product.description;
            const price=document.createElement("p");
            price.textContent="Price: ₹"+product.price;
            const stock=document.createElement("p");
            stock.textContent="Available Stock: "+product.stock;
            const button=document.createElement("button");
            button.textContent="Add to Cart";
            button.disabled=product.stock<=0;
            button.addEventListener("click",()=>addToCart(product.id));
            div.append(emoji,name,description,price,stock,button);
            productList.appendChild(div);
        });
    }catch(error){
        productList.textContent="Unable to load products.";
        message.textContent=error.message;
    }
}
// Add product to cart
async function addToCart(productId){
    try{
        const response=await fetch("/api/cart",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({productId:productId})
        });
        const result=await response.json();
        message.textContent=result.message;
        if(response.ok) loadCart();
    }catch(error){
        message.textContent="Unable to add product.";
    }
}
// Load cart from MongoDB
async function loadCart(){
    try{
        const response=await fetch("/api/cart");
        const result=await response.json();
        if(!response.ok) throw new Error(result.message);
        cartItems.innerHTML="";
        if(result.data.length===0){
            cartItems.textContent="Your cart is empty.";
        }
        result.data.forEach(item=>{
            const div=document.createElement("div");
            div.className="cart-item";
            const details=document.createElement("span");
            details.textContent=item.name+" x "+item.quantity+" = ₹"+(item.price*item.quantity);
            const button=document.createElement("button");
            button.className="remove-btn";
            button.textContent="Remove";
            button.addEventListener("click",()=>removeFromCart(item.id));
            div.append(details,button);
            cartItems.appendChild(div);
        });
        total.textContent="Total: ₹"+result.total;
    }catch(error){
        cartItems.textContent="Unable to load cart.";
    }
}
// Remove product from cart
async function removeFromCart(productId){
    try{
        const response=await fetch("/api/cart/"+productId,{method:"DELETE"});
        const result=await response.json();
        message.textContent=result.message;
        if(response.ok) loadCart();
    }catch(error){
        message.textContent="Unable to remove product.";
    }
}
// Place an order
async function placeOrder(){
    try{
        const response=await fetch("/api/orders",{method:"POST"});
        const result=await response.json();
        message.textContent=result.message;
        if(response.ok){
            loadCart();
            loadProducts();
        }
    }catch(error){
        message.textContent="Unable to place order.";
    }
}
// Load products and cart when page opens
loadProducts();
loadCart();