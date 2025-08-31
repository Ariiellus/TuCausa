"use client"

import { CreateCampaignForm } from "@/components/create-campaign-form"
import { ClientOnly } from "@/components/client-only"

export default function CreateCausePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-foreground mb-2">Create Campaign</h1>
            <p className="text-muted-foreground">
              Create a fundraising campaign for your local cause and get community support
            </p>
          </div>
          <ClientOnly 
            fallback={
              <div className="bg-card rounded-lg p-8">
                <div className="animate-pulse space-y-6">
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-24 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-4 bg-muted rounded w-1/4"></div>
                  <div className="h-10 bg-muted rounded"></div>
                  <div className="h-12 bg-muted rounded"></div>
                </div>
              </div>
            }
          >
            <CreateCampaignForm />
          </ClientOnly>
        </div>
      </div>
    </div>
  )
}