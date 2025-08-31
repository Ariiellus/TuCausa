import { Loader2 } from "lucide-react"
import { Header } from "@/components/header"
import { Card, CardContent } from "@/components/ui/card"

export default function Loading() {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="py-8">
              <div className="flex items-center justify-center">
                <Loader2 className="h-6 w-6 animate-spin mr-2" />
                <span>Loading campaign...</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
