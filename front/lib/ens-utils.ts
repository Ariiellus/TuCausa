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

// ENS resolution utilities
export async function resolveEnsName(address: string): Promise<string | null> {
  try {
    // Try Base network first
    const baseResponse = await fetch(`https://api.basescan.org/api?module=proxy&action=eth_call&data=0x3d3d8c8b&to=0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e&apikey=YourApiKeyToken`)
    
    // If that fails, try Ethereum mainnet
    const mainnetResponse = await fetch(`https://api.etherscan.io/api?module=proxy&action=eth_call&data=0x3d3d8c8b&to=0x00000000000C2E074eC69A0dFb2997BA6C7d2e1e&apikey=YourApiKeyToken`)
    
    // For now, return null and let wagmi handle it
    return null
  } catch (error) {
    console.error('ENS resolution error:', error)
    return null
  }
}

export function formatAddress(address: string): string {
  if (!address) return ''
  return `${address.slice(0, 6)}...${address.slice(-4)}`
}

export function isValidEnsName(name: string): boolean {
  // Basic ENS name validation
  const ensRegex = /^[a-z0-9-]+\.eth$/
  return ensRegex.test(name)
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
