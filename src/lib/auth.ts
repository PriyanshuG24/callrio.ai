import { betterAuth } from "better-auth";
import {drizzleAdapter} from "better-auth/adapters/drizzle";
import {db} from "./db";
import { nextCookies } from "better-auth/next-js";
export const auth=betterAuth({
    database:drizzleAdapter(db,{
        provider:"pg",  
    }),
    emailAndPassword:{
        enabled:true,
        minPasswordLength:6,
        maxPasswordLength:128,
        autoSignIn:false,
        mapProfileToUser:(profile:any)=>{
            return {
                name:profile.name,
                email:profile.email,
                image:profile.picture,
            }
        }
    },
    socialProviders: {
        google: {   
            clientId: process.env.GOOGLE_CLIENT_ID as string, 
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string, 
            mapProfileToUser: (profile:any) => {
                return {
                    name: profile.name,
                    email: profile.email,
                    image: profile.picture,
                }
            }
        }, 
    },
    plugins:[
        nextCookies(),
    ]
})