import { users } from "../utils/constants.mjs";

export const getUserIndex = (req,res,next)=>{
    const uid = parseInt(req.params.id);
    if(isNaN(uid)){
        res.status(400).send({msg:"Bad request, Invalis Id"})
    }
    const userIndex = users.findIndex((user)=>user.id === uid);
    if(userIndex === -1){
        res.status(404).send({msg:"Id not found"});
    }
    req.userIndex = userIndex;
    next();
}
