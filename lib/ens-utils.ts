// ENS subdomain utilities
export function generateEnsSubdomain(campaignTag: string): string {
  // Validate and clean the campaign tag
  const cleanedTag = campaignTag
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "") // Only allow letters, numbers, and hyphens
    .replace(/^-+|-+$/g, "") // Remove leading/trailing hyphens
  
  // Ensure it meets length requirements
  if (cleanedTag.length < 8) {
    throw new Error("Project name must be at least 8 characters long")
  }
  
  if (cleanedTag.length > 20) {
    throw new Error("Project name must be no more than 20 characters long")
  }
  
  return cleanedTag
}

export function getEnsUrl(subdomain: string): string {
  return `https://${subdomain}.tucausa.eth`
}

export function getCampaignUrl(campaignAddress: string): string {
  return `/campaign/${campaignAddress}`
}

// Campaign creation utilities
export function generateCampaignId(): string {
  return Math.random().toString(36).substring(2, 15)
}

export function formatUSDC(amount: bigint): string {
  // USDC has 6 decimals
  const divisor = BigInt(10 ** 6)
  const dollars = amount / divisor
  const cents = amount % divisor
  return `${dollars}.${cents.toString().padStart(6, "0").slice(0, 2)}`
}
