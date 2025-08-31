import { type NextRequest, NextResponse } from "next/server"
import { Synapse, RPC_URLS } from "@filoz/synapse-sdk"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    if (!process.env.SYNAPSE_PRIVATE_KEY) {
      return NextResponse.json({ error: "Synapse private key not configured" }, { status: 500 })
    }

    // Initialize Synapse with private key for server-side operations
    const synapse = await Synapse.create({
      privateKey: process.env.SYNAPSE_PRIVATE_KEY,
      rpcURL: RPC_URLS.calibration.websocket,
    })

    // Create storage service
    const storage = await synapse.createStorage()

    // Convert file to Uint8Array for upload
    const arrayBuffer = await file.arrayBuffer()
    const data = new Uint8Array(arrayBuffer)

    // Upload to Filecoin via Synapse
    const uploadResult = await storage.upload(data)

    return NextResponse.json({ commp: uploadResult.commp })
  } catch (error) {
    console.error("Error uploading to Synapse:", error)
    return NextResponse.json({ error: "Failed to upload file" }, { status: 500 })
  }
}
