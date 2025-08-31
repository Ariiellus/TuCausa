export function getSynapseUrl(commp: string): string {
  // Return a gateway URL for accessing stored data via CommP
  return `https://synapse.filoz.org/retrieve/${commp}`
}

// Client-side upload function that calls our secure API
export async function uploadToSynapse(file: File): Promise<string> {
  const formData = new FormData()
  formData.append("file", file)

  const response = await fetch("/api/upload-to-synapse", {
    method: "POST",
    body: formData,
  })

  if (!response.ok) {
    throw new Error("Failed to upload file to Synapse")
  }

  const { commp } = await response.json()
  return commp
}

export async function uploadJSONToSynapse(data: any, filename = "data.json"): Promise<string> {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
  const file = new File([blob], filename, { type: "application/json" })
  return await uploadToSynapse(file)
}
