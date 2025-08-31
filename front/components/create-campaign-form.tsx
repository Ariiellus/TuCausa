"use client"

import { useTuCausa } from "@/hooks/use-tucausa"
import { useCampaignFactory } from "@/hooks/use-campaign-factory"
import { useUSDC } from "@/hooks/use-usdc"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useState } from "react"

export function CreateCampaignForm() {
  const { isConnected, isBaseNetwork } = useTuCausa()
  const { createNewCampaign, isCreating } = useCampaignFactory()
  
  // Helper function to parse USDC amount
  const parseUSDC = (amount: string) => {
    const [whole, fraction = "0"] = amount.split(".")
    const paddedFraction = fraction.padEnd(6, "0").slice(0, 6)
    return BigInt(whole + paddedFraction)
  }
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    goalAmount: "",
    ensSubdomain: "",
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title || !formData.description || !formData.goalAmount || !formData.ensSubdomain) {
      alert("Please fill in all fields")
      return
    }

    if (!isBaseNetwork) {
      alert("Please switch to Base network to create campaigns. Use the 'Switch to Base' button in the header.")
      return
    }

    console.log("Form submitted with data:", formData)
    console.log("Current network check - isBaseNetwork:", isBaseNetwork)
    
    try {
      const goalAmount = parseUSDC(formData.goalAmount)
      console.log("Parsed goal amount:", goalAmount.toString())
      
      createNewCampaign(
        formData.title,
        formData.description,
        goalAmount,
        formData.ensSubdomain
      )

      // Only reset form if no error occurred
      // setFormData({
      //   title: "",
      //   description: "",
      //   goalAmount: "",
      //   ensSubdomain: "",
      // })
    } catch (error) {
      console.error("Error in form submission:", error)
      alert("Error processing form. Please check the console for details.")
    }
  }

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  if (!isConnected) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-600">Please connect your wallet to create a campaign</p>
        </CardContent>
      </Card>
    )
  }

      if (!isBaseNetwork) {
    return (
      <Card>
        <CardContent className="p-6">
          <Alert>
            <AlertDescription>
              Campaign creation is only available on Base network. Please switch to Base network to continue.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle>Create New Campaign</CardTitle>
        <CardDescription>
          Start a new cause and raise funds from the community
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="title">Campaign Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder="Enter campaign title"
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Describe your cause and how the funds will be used"
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="goalAmount">Goal Amount (USDC)</Label>
            <Input
              id="goalAmount"
              type="text"
              value={formData.goalAmount}
              onChange={(e) => handleInputChange("goalAmount", e.target.value)}
              placeholder="100.00"
              required
            />
            <p className="text-xs text-gray-600 mt-1">
              Enter the amount in USDC (e.g., 100.00 for 100 USDC)
            </p>
          </div>

          <div>
            <Label htmlFor="ensSubdomain">ENS Subdomain</Label>
            <Input
              id="ensSubdomain"
              value={formData.ensSubdomain}
              onChange={(e) => handleInputChange("ensSubdomain", e.target.value)}
              placeholder="mycause"
              required
            />
            <p className="text-xs text-gray-600 mt-1">
              This will be used for the campaign's ENS subdomain
            </p>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isCreating || !isBaseNetwork}
          >
            {isCreating ? "Creating Campaign..." : "Create Campaign"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
