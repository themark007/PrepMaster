import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

export const protect =(req,res,next)=>{
    dotenv.config();
    const token =req.headers.authorization?.split(' ')[1];
    if(!token){
        return res.status(401).json({message: 'Not authorized, no token'});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }catch(err){
        res.status(401).json({message: 'Not authorized, token failed'});
    }
};