import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import jwt from "jsonwebtoken"
const router = Router();

const prismaClient = new PrismaClient()

const JWT_SECRET = "hfjfhskdjfhkh"
router.post("/signin", async (req,res) => {
    // TODO: ADD SIGN VERIFICATION
    const address = "fsjhdfidhuiehsoijfpojfpwojpaojpw"

    const existingUser = await prismaClient.user.findFirst({
        where: {
            address
        }
    })

    if (existingUser) {
        const token = jwt.sign({
            userId: existingUser.id
        }, JWT_SECRET)
        res.json({token})
        
    } else {
        const user = await prismaClient.user.create({
            data: {
                address
            }
        })
        const token = jwt.sign({
            userId: user.id
        }, JWT_SECRET)
        res.json({token})
    }
})


export default router