import { products } from "../utils/constants.mjs";
import { Router } from "express";

const router = Router();

router.get('/products',(req,res)=>{
    req.session.visited = true;
    console.log(req.session.id)
    const {query:{filter , value}} = req;
    if(filter && value){
        return res.send(products.filter((product)=>product[filter].toLowerCase().includes(value)))
    }
    res.send(products)
})

router.get('/products/:pid',(req,res)=>{
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

export default router;