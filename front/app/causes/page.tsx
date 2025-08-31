import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Wallet } from "lucide-react"
import Link from "next/link"
import { CAMPAIGN_FACTORY_ADDRESS, CAMPAIGN_FACTORY_ABI, CAMPAIGN_ABI } from "@/lib/contracts"
import { createPublicClient, http } from "viem"
import { base, baseSepolia } from "wagmi/chains"

interface Campaign {
  id: `0x${string}`
  title: string
  description: string
  goalAmount: number
  totalRaised: number
  creator: string
  state: string
  ensSubdomain: string
  chainId: number
}

// Create public clients for reading blockchain data
const baseClient = createPublicClient({
  chain: base,
  transport: http(),
})

const baseSepoliaClient = createPublicClient({
  chain: baseSepolia,
  transport: http(),
})

// Function to fetch campaign data from blockchain
async function fetchCampaigns() {
  try {
    // Only try Sepolia since Base Mainnet is not deployed yet
    const sepoliaFactoryAddress = CAMPAIGN_FACTORY_ADDRESS[11155111]
    if (!sepoliaFactoryAddress) {
      console.error("No Sepolia factory address found")
      return []
    }

    console.log("Fetching campaigns from Sepolia factory:", sepoliaFactoryAddress)
    
    const campaigns = await baseSepoliaClient.readContract({
      address: sepoliaFactoryAddress as `0x${string}`,
      abi: CAMPAIGN_FACTORY_ABI,
      functionName: "getAllCampaigns",
    })

    console.log("Found campaigns:", campaigns)

    if (campaigns && campaigns.length > 0) {
      const campaignData = await Promise.all(
        campaigns.map(async (campaignAddress) => {
          try {
            console.log("Fetching data for campaign:", campaignAddress)
            
            const [title, description, goalAmount, totalRaised, creator, state, ensSubdomain] = await Promise.all([
              baseSepoliaClient.readContract({
                address: campaignAddress as `0x${string}`,
                abi: CAMPAIGN_ABI,
                functionName: "title",
              }),
              baseSepoliaClient.readContract({
                address: campaignAddress as `0x${string}`,
                abi: CAMPAIGN_ABI,
                functionName: "description",
              }),
              baseSepoliaClient.readContract({
                address: campaignAddress as `0x${string}`,
                abi: CAMPAIGN_ABI,
                functionName: "goalAmount",
              }),
              baseSepoliaClient.readContract({
                address: campaignAddress as `0x${string}`,
                abi: CAMPAIGN_ABI,
                functionName: "totalRaised",
              }),
              baseSepoliaClient.readContract({
                address: campaignAddress as `0x${string}`,
                abi: CAMPAIGN_ABI,
                functionName: "creator",
              }),
              baseSepoliaClient.readContract({
                address: campaignAddress as `0x${string}`,
                abi: CAMPAIGN_ABI,
                functionName: "state",
              }),
              baseSepoliaClient.readContract({
                address: campaignAddress as `0x${string}`,
                abi: CAMPAIGN_ABI,
                functionName: "ensSubdomain",
              }),
            ])

            console.log("Campaign data fetched:", { title, description, goalAmount, totalRaised, creator, state, ensSubdomain })

            return {
              id: campaignAddress,
              title: title as string,
              description: description as string,
              goalAmount: Number(goalAmount) / 1e6, // Convert from wei to USDC (6 decimals)
              totalRaised: Number(totalRaised) / 1e6,
              creator: creator as string,
              state: getStateString(state as number),
              ensSubdomain: ensSubdomain as string,
              chainId: 11155111,
            }
          } catch (error) {
            console.error(`Error fetching campaign ${campaignAddress}:`, error)
            return null
          }
        })
      )

      const validCampaigns = campaignData.filter(Boolean)
      console.log("Valid campaigns:", validCampaigns)
      return validCampaigns
    }

    console.log("No campaigns found")
    return []
  } catch (error) {
    console.error("Error fetching campaigns:", error)
    return []
  }
}

function getStateString(state: number): string {
  switch (state) {
    case 0:
      return "Active"
    case 1:
      return "Under Review"
    case 2:
      return "Completed"
    case 3:
      return "Refunded"
    default:
      return "Unknown"
  }
}

export default async function CausesPage() {
  const campaigns = await fetchCampaigns()
  const validCampaigns = campaigns.filter((campaign): campaign is Campaign => campaign !== null)

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Local Causes</h1>
            <p className="text-muted-foreground">Support your community by donating to local causes</p>
          </div>
          <Button asChild className="flex items-center gap-2">
            <Link href="/create">
              <Wallet className="h-4 w-4" />
              Start a Cause
            </Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {validCampaigns.map((cause) => {
            const progressPercentage = (cause.totalRaised / cause.goalAmount) * 100

            return (
              <Card key={cause.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={
                        cause.state === "Active"
                          ? "default"
                          : cause.state === "Under Review"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {cause.state}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      Sepolia
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">{cause.title}</CardTitle>
                  <CardDescription>{cause.description}</CardDescription>
                </CardHeader>

                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-2">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium">
                          ${cause.totalRaised.toLocaleString()} / ${cause.goalAmount.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progressPercentage} className="h-2" />
                      <p className="text-xs text-muted-foreground mt-1">{Math.round(progressPercentage)}% funded</p>
                    </div>

                    <div className="flex gap-2">
                      <Button className="flex-1" asChild>
                        <Link href={`/campaign/${cause.id}`}>
                          {cause.state === "Active" ? "Donate" : "View Details"}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`https://${cause.ensSubdomain}`} target="_blank">
                          ENS
                        </Link>
                      </Button>
                    </div>

                    <div className="text-xs text-muted-foreground">
                      <p>Creator: {cause.creator.slice(0, 6)}...{cause.creator.slice(-4)}</p>
                      <p>Campaign: {cause.id.slice(0, 6)}...{cause.id.slice(-4)}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {validCampaigns.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No causes found on blockchain</p>
            <Button asChild className="flex items-center gap-2">
              <Link href="/create">
                <Wallet className="h-4 w-4" />
                Create the First Cause
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
