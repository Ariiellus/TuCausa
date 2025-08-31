import { Header } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"

// Mock data for now - will be replaced with real blockchain data
const mockCauses = [
  {
    id: "0x123...",
    title: "Fix Neighborhood Potholes",
    description: "Repair dangerous potholes on Main Street that have been causing car damage",
    goalAmount: 5000,
    totalRaised: 3200,
    status: "Active",
    ensSubdomain: "potholes123.tucausa.eth",
  },
  {
    id: "0x456...",
    title: "Community Garden Project",
    description: "Create a shared garden space for local families to grow fresh vegetables",
    goalAmount: 8000,
    totalRaised: 8000,
    status: "Under Review",
    ensSubdomain: "garden456.tucausa.eth",
  },
  {
    id: "0x789...",
    title: "School Playground Equipment",
    description: "Replace old and unsafe playground equipment at Lincoln Elementary",
    goalAmount: 12000,
    totalRaised: 12000,
    status: "Completed",
    ensSubdomain: "playground789.tucausa.eth",
  },
]

export default function CausesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Local Causes</h1>
            <p className="text-muted-foreground">Support your community by donating to local causes</p>
          </div>
          <Button asChild>
            <Link href="/create">Start a Cause</Link>
          </Button>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mockCauses.map((cause) => {
            const progressPercentage = (cause.totalRaised / cause.goalAmount) * 100

            return (
              <Card key={cause.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start mb-2">
                    <Badge
                      variant={
                        cause.status === "Active"
                          ? "default"
                          : cause.status === "Under Review"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {cause.status}
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
                      <Button asChild className="flex-1">
                        <Link href={`/campaign/${cause.id}`}>
                          {cause.status === "Active" ? "Donate" : "View Details"}
                        </Link>
                      </Button>
                      <Button variant="outline" size="sm" asChild>
                        <Link href={`https://${cause.ensSubdomain}`} target="_blank">
                          ENS
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {mockCauses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No causes found</p>
            <Button asChild>
              <Link href="/create">Create the First Cause</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
