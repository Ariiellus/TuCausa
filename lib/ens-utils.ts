// ENS subdomain utilities
export function generateEnsSubdomain(title: string): string {
  // Convert title to a valid ENS subdomain
  const subdomain = title
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .substring(0, 20) // Limit length

  // Add random suffix to ensure uniqueness
  const randomSuffix = Math.random().toString(36).substring(2, 8)
  return `${subdomain}${randomSuffix}`
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
