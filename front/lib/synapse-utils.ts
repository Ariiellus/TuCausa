export function getSynapseUrl(commp: string): string {
  // Return a gateway URL for accessing stored data via CommP
  return `https://synapse.filoz.org/retrieve/${commp}`
}

// Mock upload function for development when Synapse is not configured
async function mockUploadToSynapse(file: File): Promise<string> {
  console.log("Using mock upload for development")
  
  // Simulate upload delay
  await new Promise(resolve => setTimeout(resolve, 1000))
  
  // Generate a mock commp (this is just for development)
  const mockCommp = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  console.log("Mock upload successful:", mockCommp)
  return mockCommp
}

// Client-side upload function that calls our secure API
export async function uploadToSynapse(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  console.log("Uploading file to Synapse:", {
    name: file.name,
    size: file.size,
    type: file.type
  })

  try {
    const response = await fetch("/api/upload-to-synapse", {
      method: "POST",
      body: formData,
    })

    console.log("Response status:", response.status)
    console.log("Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      let errorData
      try {
        errorData = await response.json()
      } catch (e) {
        errorData = { error: `HTTP ${response.status}: ${response.statusText}` }
      }
      
      console.error("Synapse upload failed:", {
        status: response.status,
        statusText: response.statusText,
        errorData,
        responseText: await response.text().catch(() => "Could not read response text")
      })
      
      // If Synapse is not configured, use mock upload for development
      if (errorData.error?.includes("Private key not configured")) {
        console.warn("Synapse not configured, using mock upload for development")
        return await mockUploadToSynapse(file)
      }
      
      throw new Error(`Failed to upload file to Synapse: ${errorData.error || errorData.details || 'Unknown error'}`)
    }

    const { commp } = await response.json()
    console.log("Upload successful, commp:", commp)
    return commp
  } catch (error) {
    console.error("Network error during upload:", error)
    
    // For development, fall back to mock upload
    if (process.env.NODE_ENV === 'development') {
      console.warn("Network error, using mock upload for development")
      return await mockUploadToSynapse(file)
    }
    
    throw error
  }
}

export async function uploadJSONToSynapse(data: any, filename = "data.json"): Promise<string> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const file = new File([blob], filename, { type: "application/json" })
  return await uploadToSynapse(file)
}
