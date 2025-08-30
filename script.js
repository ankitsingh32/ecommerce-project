const API = "http://localhost:5000/api";

// Fetch products
async function loadProducts(){
  const res = await fetch(`${API}/products`);
  const products = await res.json();
  const list = document.getElementById("product-list");
  if(list){
    list.innerHTML="";
    products.forEach(p=>{
      let card=document.createElement("div");
      card.className="product-card";
      card.innerHTML=`
        <img src="${p.image}" alt="">
        <h4>${p.name}</h4>
        <p>₹${p.price}</p>
        <button onclick="addToCart(${p.id})">Add to Cart</button>
      `;
      list.appendChild(card);
    });
  }
}
if(document.getElementById("product-list")) loadProducts();

// Apply filters
async function applyFilters(){
  const cat=document.getElementById("filter-category").value;
  const max=document.getElementById("filter-price").value;
  const res=await fetch(`${API}/products?category=${cat}&max=${max}`);
  const products=await res.json();
  const list=document.getElementById("product-list");
  list.innerHTML="";
  products.forEach(p=>{
    let card=document.createElement("div");
    card.className="product-card";
    card.innerHTML=`<img src="${p.image}"><h4>${p.name}</h4><p>₹${p.price}</p><button onclick="addToCart(${p.id})">Add to Cart</button>`;
    list.appendChild(card);
  });
}

// Add to cart
async function addToCart(id){
  await fetch(`${API}/cart`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({id})});
  alert("Added to cart!");
}

// Load cart
async function loadCart(){
  const res=await fetch(`${API}/cart`);
  const cart=await res.json();
  const div=document.getElementById("cart");
  if(div){
    div.innerHTML=cart.map(c=>`<div>${c.name} - ₹${c.price}</div>`).join("");
  }
}
if(document.getElementById("cart")) loadCart();

// Place order
async function placeOrder(){
  const mode=document.getElementById("payment-mode").value;
  const date=document.getElementById("delivery-date").value;
  const res=await fetch(`${API}/order`,{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({mode,date})});
  const data=await res.json();
  alert("Order placed! ID: "+data.id);
}

// Track order
async function trackOrder(){
  const id=document.getElementById("order-id").value;
  const res=await fetch(`${API}/track/${id}`);
  const data=await res.json();
  document.getElementById("tracking-result").innerText="Status: "+data.status;
}
