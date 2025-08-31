import { type NextRequest, NextResponse } from "next/server"
import { Synapse, RPC_URLS } from "@filoz/synapse-sdk"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      console.error("No file provided in request")
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    console.log("File received:", {
      name: file.name,
      size: file.size,
      type: file.type
    })

    // Debug environment variables
    console.log("Environment check:", {
      hasPrivateKey: !!process.env.PRIVATE_KEY,
      privateKeyLength: process.env.PRIVATE_KEY?.length || 0,
      nodeEnv: process.env.NODE_ENV,
      hasCustomRpc: !!process.env.SYNAPSE_RPC_URL
    })

    if (!process.env.PRIVATE_KEY) {
      console.error("PRIVATE_KEY environment variable not set")
      return NextResponse.json({ 
        error: "Private key not configured. Please set PRIVATE_KEY environment variable." 
      }, { status: 500 })
    }

    console.log("Initializing Synapse with private key...")
    
    try {
      // Use custom RPC URL if provided, otherwise use calibration testnet
      const rpcUrl = process.env.SYNAPSE_RPC_URL || RPC_URLS.calibration.websocket
      console.log("Using RPC URL:", rpcUrl)
      
      // Initialize Synapse with private key for server-side operations
      const synapse = await Synapse.create({
        privateKey: process.env.PRIVATE_KEY,
        rpcURL: rpcUrl,
      })

      console.log("Synapse created successfully")

      console.log("Creating storage service...")
      
      // Create storage service
      const storage = await synapse.createStorage()

      console.log("Storage service created successfully")

      console.log("Converting file to Uint8Array...")
      
      // Convert file to Uint8Array for upload
      const arrayBuffer = await file.arrayBuffer()
      const data = new Uint8Array(arrayBuffer)

      console.log("File converted, size:", data.length)

      console.log("Uploading to Filecoin via Synapse...")
      
      // Upload to Filecoin via Synapse
      const uploadResult = await storage.upload(data)

      console.log("Upload successful:", uploadResult.commp)

      return NextResponse.json({ commp: uploadResult.commp })
    } catch (synapseError) {
      console.error("Synapse-specific error:", synapseError)
      return NextResponse.json({ 
        error: "Synapse initialization or upload failed",
        details: synapseError instanceof Error ? synapseError.message : "Unknown Synapse error"
      }, { status: 500 })
    }
  } catch (error) {
    console.error("Error uploading to Synapse:", error)
    
    // Return more detailed error information
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    return NextResponse.json({ 
      error: "Failed to upload file",
      details: errorMessage
    }, { status: 500 })
  }
}
