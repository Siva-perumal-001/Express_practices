import { Router } from "express";
import { getUserIndex } from "../utils/middlewares.mjs";
import { users } from "../utils/constants.mjs";
import { userValidatationSchema } from "../utils/ValidateSchemas.mjs";
import { validationResult, matchedData, checkSchema } from "express-validator";

const router = Router()

router.get("/users",(req,res)=>{
    console.log(req.signedCookies)

    if(req.signedCookies.Role && req.signedCookies.Role === "Admin" ){
        const {query:{filter,value}} = req;
        if(filter && value){
            return res.send(users.filter((user)=>user[filter].toLowerCase().includes(value)))
        }
        res.send(users)
    }
    else{
        res.send({msg:"u have no access coz ur not admin"})
    }
})

router.get("/users/:id" ,(req,res)=>{
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

router.put("/users/:id" ,getUserIndex ,(req,res)=>{
    const userIndex = req.userIndex;
    const uid = parseInt(req.params.id);
    const {body} = req;
    users[userIndex] = {id:uid, ...body};
    res.status(200).send({msg:"User Updated"});
})

router.patch("/users/:id" ,getUserIndex ,(req,res)=>{
    const userIndex = req.userIndex;
    const {body} = req;
    users[userIndex] = { ...users[userIndex] , ...body };
    return res.sendStatus(200);
})

router.delete("/users/:id" ,getUserIndex ,(req,res)=>{
    const userIndex = req.userIndex;
    users.splice(userIndex,1);
    return res.status(200).send({msg:"user deleted"});
})

router.post('/users',
    checkSchema(userValidatationSchema),
    (req,res)=>{
    const result = validationResult(req);
    
    if(!result.isEmpty()){
        res.status(400).send({error:result.array()})
    }

    const body = matchedData(req);
    const newUser = {id: users[users.length-1].id+1, ...body}
    users.push(newUser);
    return res.status(201).send(newUser)
})

export default router;