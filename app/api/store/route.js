import { NextResponse } from "next/server";
import { getAuth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/db"; // Adjust if your prisma instance is elsewhere
import imagekit from "@/lib/imagekit"; // Adjust if your imagekit instance is elsewhere

export async function POST(request) {
  try {
    const { userId } = getAuth(request);
    const formData = await request.formData();

    const name = formData.get("name") 
    const username = formData.get("username") 
    const description = formData.get("description") 
    const email = formData.get("email") 
    const contact = formData.get("contact") 
    const address = formData.get("address") 
    const img = formData.get("img") 

    if (!name || !username || !description || !email || !contact || !address || !img) {
      return NextResponse.json({ message: "missing store info" }, { status: 400 });
    }

    const existingStore = await prisma.store.findFirst({
      where: { userId: userId },
    });

    if (existingStore) {
      return NextResponse.json({ message: existingStore.status });
    }

    const usernameTaken = await prisma.store.findFirst({
      where: { username: username.toLowerCase() },
    });

    if (usernameTaken) {
      return NextResponse.json({ message: "This username is already taken" }, { status: 400 });
    }

    // Upload image to ImageKit
    const buffer = Buffer.from(await img.arrayBuffer());

    const response = await imagekit.upload({
      file: buffer,
      fileName: img.name,
      folder: "logos",
    });

    // Generate optimized image URL
    const optimizedImage = imagekit.url({
      path: response.filePath,
      transformation: [{ quality: "auto" }],
    });

    // Create new store
    const newStore = await prisma.store.create({
      data: {
        userId,
        name,
        description,
        username: username.toLowerCase(),
        email,
        contact,
        address,
        logo: optimizedImage,
      },
    });

    // Link store to user
    await prisma.user.update({
      where: { id: userId },
      data: { store: { connect: { id: newStore.id } } },
    });

    return NextResponse.json({ message: "applied, waiting for approval" });

  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: error.code || error.message },
      { status: 400 }
    );
  }
}


export async function GET(request){
    try{

    }catch(error){
        
    }
}