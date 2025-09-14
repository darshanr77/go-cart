import { NextResponse } from "next/server";
import { POST } from "../inngest/route"
import { getAuth } from "@clerk/nextjs/server"




export async function POST(request){
    try{
        const {userId} = getAuth(request);
        const formData = await request.formData()

        const name = formData.get("name")
        const username = formData.get("username")
        const description = formData.get("description")
        const email = formData.get("email")
        const contact = formData.get("contact")
        const address = formData.get("address")
        const img = formData.get("img")

        if(!name || !username || !description || !email || !contact || !address || !img){
            return NextResponse.json({message:"missing store info"},{status:400});
        }

        const existingStore = await prisma.store.findFirst({
            where:{userId:userId}
        })

        if(existingStore){
            return NextResponse({message:existingStore.status})
        }

        const usernametaken = await prisma.store.findFirst({
            where : {username : username.toLowerCase()}
        })

        if(usernametaken){
            return NextResponse.json({message:"This username is already taken"},{status:400});
        }
    }catch(error){

    }
}