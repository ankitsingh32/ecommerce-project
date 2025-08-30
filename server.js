const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();
app.use(cors());
app.use(express.json());

let products = JSON.parse(fs.readFileSync("products.json","utf-8"));
let cart = [];
let orders = [];

// Get products with filters
app.get("/api/products",(req,res)=>{
  let result=products;
  if(req.query.category && req.query.category!=="all"){
    result=result.filter(p=>p.category===req.query.category);
  }
  if(req.query.max){
    result=result.filter(p=>p.price<=parseInt(req.query.max));
  }
  res.json(result);
});

// Cart APIs
app.get("/api/cart",(req,res)=>res.json(cart));
app.post("/api/cart",(req,res)=>{
  const prod=products.find(p=>p.id===req.body.id);
  if(prod) cart.push(prod);
  res.json(cart);
});

// Order APIs
app.post("/api/order",(req,res)=>{
  const id=Math.random().toString(36).substr(2,9);
  const order={id,cart:[...cart],mode:req.body.mode,date:req.body.date,status:"Processing"};
  orders.push(order);
  cart=[];
  res.json({id});
});
app.get("/api/track/:id",(req,res)=>{
  const order=orders.find(o=>o.id===req.params.id);
  if(order) res.json(order);
  else res.json({status:"Not Found"});
});

app.listen(5000,()=>console.log("Server running on http://localhost:5000"));
