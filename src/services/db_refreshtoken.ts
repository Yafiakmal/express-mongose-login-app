import "dotenv/config";
import { Types } from "mongoose";
import jwt, { JwtPayload } from "jsonwebtoken"; 
import { RefreshToken, IRefreshToken } from "../models/RefreshToken.js";
// import jwt, { JsonWebTokenError } from "jsonwebtoken";
import bcrypt, { compare } from "bcrypt";


// add refresh token
export async function addRefreshToken(user_id: Types.ObjectId, token:string){
    if (!user_id && !token) {
        throw new Error("user_id and token not provided");
    }

    try {
        if(!process.env.JWT_RT_SECRET){
            throw new Error("secret key not provided");
        }
        const decoded = jwt.verify(token, process.env.JWT_RT_SECRET) as JwtPayload;
        if (decoded){
            const expires_at = new Date(decoded.exp as number * 1000);
            
            const refreshToken = new RefreshToken({user_id, token, expires_at})
            const res = await refreshToken.save()
            console.info('addRefreshtoken: ',res)
        }
    } catch (error) {
        throw error
    }
}
// revoke refresh token