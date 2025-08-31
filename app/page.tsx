import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/header"
import { Heart, Users, Shield, Zap } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <Header />

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 text-balance">
            Fund Local Causes with <span className="text-primary">Transparency</span>
          </h1>
          <p className="text-lg text-muted-foreground mb-8 text-pretty">
            TuCausa empowers communities to create and support local causes using USDC on Base. Every donation is
            transparent, every cause is verified by the community.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/create">Start a Cause</Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8 bg-transparent">
              <Link href="/causes">View Causes</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Why Choose TuCausa?</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Built on Base blockchain for transparency, security, and community trust
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="text-center">
            <CardHeader>
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Transparent</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                All donations and fund releases are recorded on-chain for complete transparency
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Community Verified</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Donors vote on proof submissions to ensure causes are legitimate and completed
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Zap className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Fast & Secure</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Built on Base for fast, low-cost transactions with enterprise-grade security
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
              <CardTitle>Local Impact</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>Focus on local causes that make a real difference in your community</CardDescription>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-muted py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">How It Works</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Simple, transparent process from cause creation to completion
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-2">Create a Cause</h3>
              <p className="text-muted-foreground">Submit your local cause with a clear description and funding goal</p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-2">Receive Donations</h3>
              <p className="text-muted-foreground">Community members donate USDC to support your cause</p>
            </div>

            <div className="text-center">
              <div className="bg-primary text-primary-foreground rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-2">Submit Proof</h3>
              <p className="text-muted-foreground">Upload proof of completion and let donors verify your work</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-16 text-center">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-foreground mb-4">Ready to Make a Difference?</h2>
          <p className="text-muted-foreground mb-8">
            Join the TuCausa community and start supporting local causes today
          </p>
          <Button asChild size="lg" className="text-lg px-8">
            <Link href="/create">Start Your First Cause</Link>
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-muted">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center gap-2 mb-4 md:mb-0">
              <Heart className="h-5 w-5 text-primary" />
              <span className="font-semibold text-foreground">TuCausa</span>
            </div>
            <p className="text-sm text-muted-foreground">Built on Base • Powered by Community</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
