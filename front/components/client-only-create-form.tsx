"use client"

import { CreateCampaignForm } from "./create-campaign-form"
import { useState, useEffect } from "react"

export function ClientOnlyCreateForm() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) {
    return (
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
    )
  }

  return <CreateCampaignForm />
}