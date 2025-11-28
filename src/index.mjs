import express from "express";

const app = express();
const PORT = 3000;

const users = [
    {id:1, user_name:"siva"},
    {id:2, user_name:"ram"},
    {id:3, user_name:"sivani"},
    {id:4, user_name:"priya"},
    {id:5, user_name:"lakshmi"}
]

const products = [
    {pid:1, product_name:"laptop"},
    {pid:2, product_name:"mobile"},
    {pid:3, product_name:"headphones"},
    {pid:4, product_name:"mouse"},
    {pid:5, product_name:"keyboard"},
]

app.get('/',(req,res)=>{
    res.send({root:"Home"})
})

app.get("/users",(req,res)=>{
    const {query:{filter,value}} = req;
    if(filter && value){
        return res.send(users.filter((user)=>user[filter].toLowerCase().includes(value)))
    }
    res.send(users)
})

app.get("/users/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    if(isNaN(id)){
        return res.status(400).send({msg :"Bad request, invalid Id"})
    }
    const user = users.find((user)=>user.id === id);
    if(user){
        return res.send(user);
    }
    res.status(404).send({msg: "user not found"})
})

app.get('/products',(req,res)=>{
    const {query:{filter , value}} = req;
    if(filter && value){
        return res.send(products.filter((product)=>product[filter].toLowerCase().includes(value)))
    }
    res.send(products)
})

app.get('/products/:pid',(req,res)=>{
    const pid = parseInt(req.params.pid);
    if(isNaN(pid)){
        return res.status(400).send({msg: "bad request, Invalid Id"})
    }
    const product = products.find((product)=> product.pid === pid )
    if(product){
        return res.send(product)
    }
    res.status(404).send({msg : "product not found"})
})

app.use(express.json())

app.post('/users',(req,res)=>{
    console.log(req.body)
    const {body} = req;
    const newUser = {id: users[users.length-1].id+1, ...body}
    users.push(newUser);
    return res.status(201).send(newUser)
})

app.put("/users/:id",(req,res)=>{
    const uid = parseInt(req.params.id);
    if(isNaN(uid)){
        res.status(400).send({msg:"Bad request, Invalis Id"})
    }
    const userIndex = users.findIndex((user)=>user.id === uid);
    if(userIndex === -1){
        res.status(404).send({msg:"Id not found"});
    }
    const {body} = req;
    users[userIndex] = {id:uid, ...body};
    res.status(200).send({msg:"User Updated"});
})


app.listen(PORT,()=>{
    console.log(`App is running on PORT ${PORT}`)
})
