import express from "express";
import userRouter from './routes/users.mjs';
import productRouter from './routes/products.mjs';
import cookieParser from "cookie-parser";
import session from "express-session";
import { Strategy as LocalStrategy } from "passport-local";
import passport from "passport";
import { users } from "./utils/constants.mjs";

const app = express();
const PORT = 3000;

app.use(express.json())
app.use(cookieParser("siva"))

app.use(
    session({
        secret: "my password",
        saveUninitialized: false,
        resave: false,
        cookie:{
            maxAge: 60000 * 60 
        }
    })
);

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(
    {usernameField: "user_name" , passwordField: "password" },
    (user_name,password,done)=>{
    const user = users.find((user)=>user.user_name === user_name);
    if(!user){
        return done(null, false, {message:"Invalid Username"})
    }
    if(user.password !== password){
        return done(null, false, {message:"Incorrect Password"})
    }
    return done(null, user);
}))

passport.serializeUser((user,done)=>{
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    const user = users.find((u)=> u.id === id)
    done(null, user||false)
})

app.use(userRouter)
app.use(productRouter)

app.get('/',(req,res)=>{
    res.cookie("Role","Admin",{maxAge:60000 * 60, signed:true});
    console.log(req.session)
    console.log(req.session.id)
    res.send({root:"Home"})
})

app.post('/login', (req,res,next)=>{
    passport.authenticate("local", (err, user, info)=>{
        if(err)
            return next(err);
        if(!user){
            return res.status(401).json({ message: info?.message || "Login failed"})
        }
        req.logIn(user, (err)=>{
            if(err) return next(err);
            return res.json({message:"Login Successful", user})
        })
    })(req,res,next)
})

app.listen(PORT,()=>{
    console.log(`App is running on PORT ${PORT}`)
})
