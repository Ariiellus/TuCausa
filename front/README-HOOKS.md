# TuCausa Wagmi Hooks Documentation

This document describes how to use the comprehensive Wagmi hooks implemented for the TuCausa decentralized crowdfunding platform.

## 🎯 Overview

The TuCausa app uses Wagmi hooks to interact with smart contracts on Ethereum networks. All hooks are built using Wagmi's `useReadContract` and `useWriteContract` hooks for optimal performance and type safety.

## 📁 Hook Structure

```
front/hooks/
├── use-campaign-factory.ts    # Campaign Factory contract interactions
├── use-campaign.ts           # Individual Campaign contract interactions  
├── use-usdc.ts              # USDC token operations
└── use-tucausa.ts           # Comprehensive hook combining all functionality
```

## 🔧 Core Hooks

### 1. `useCampaignFactory()`

Handles all Campaign Factory contract interactions.

**Read Methods:**
- `campaigns` - Array of all campaign addresses
- `campaignCount` - Total number of campaigns
- `usdcToken` - USDC token address used by factory

**Write Methods:**
- `createNewCampaign(title, description, goalAmount, ensSubdomain)` - Create a new campaign

**Usage:**
```tsx
import { useCampaignFactory } from "@/hooks/use-campaign-factory"

function MyComponent() {
  const { 
    campaigns, 
    campaignCount, 
    createNewCampaign, 
    isCreating,
    isLoadingCampaigns 
  } = useCampaignFactory()

  const handleCreateCampaign = () => {
    createNewCampaign(
      "My Cause", 
      "Description", 
      BigInt(100000000), // 100 USDC (6 decimals)
      "mycause"
    )
  }

  return (
    <div>
      <p>Total campaigns: {campaignCount?.toString()}</p>
      <button onClick={handleCreateCampaign} disabled={isCreating}>
        {isCreating ? "Creating..." : "Create Campaign"}
      </button>
    </div>
  )
}
```

### 2. `useCampaign(address)`

Handles all individual Campaign contract interactions.

**Read Methods:**
- Basic info: `title`, `description`, `goalAmount`, `totalRaised`, `creator`, `state`
- Voting: `votingStatus`, `votesForSolved`, `votesForNotSolved`, `votingStartTime`
- User data: `userDonation`, `hasUserVoted` (if connected)
- Constants: `VOTING_PERIOD`, `VOTING_THRESHOLD`

**Write Methods:**
- `donateToCampaign(amount)` - Donate USDC to campaign
- `submitCampaignProof(proofURI)` - Submit proof of completion
- `voteOnCampaign(solved)` - Vote on proof submission
- `claimCampaignFunds()` - Creator claims funds (if completed)
- `claimUserRefund()` - User claims refund (if refunded)

**Usage:**
```tsx
import { useCampaign } from "@/hooks/use-campaign"

function CampaignCard({ campaignAddress }) {
  const campaign = useCampaign(campaignAddress)
  
  const handleDonate = () => {
    campaign.donateToCampaign(BigInt(10000000)) // 10 USDC
  }

  const handleVote = () => {
    campaign.voteOnCampaign(true) // Vote "solved"
  }

  return (
    <div>
      <h2>{campaign.title}</h2>
      <p>Raised: {campaign.totalRaised?.toString()} USDC</p>
      <button onClick={handleDonate} disabled={campaign.isDonating}>
        Donate
      </button>
    </div>
  )
}
```

### 3. `useUSDC()`

Handles USDC token operations.

**Read Methods:**
- `balance` - User's USDC balance
- `decimals` - Token decimals (6 for USDC)
- `totalSupply` - Total USDC supply

**Write Methods:**
- `approveSpending(spender, amount)` - Approve spending
- `transferTokens(to, amount)` - Transfer USDC
- `transferFromTokens(from, to, amount)` - Transfer from another address

**Usage:**
```tsx
import { useUSDC } from "@/hooks/use-usdc"

function WalletInfo() {
  const { balance, decimals, approveSpending } = useUSDC()

  const handleApprove = () => {
    approveSpending("0x...", BigInt(100000000)) // Approve 100 USDC
  }

  return (
    <div>
      <p>Balance: {balance?.toString()} USDC</p>
      <button onClick={handleApprove}>Approve Spending</button>
    </div>
  )
}
```

## 🚀 Comprehensive Hook: `useTuCausa()`

The main hook that combines all functionality with helper methods.

### Helper Functions

**Campaign State Checks:**
- `isCampaignCreator(address)` - Check if user is campaign creator
- `hasUserDonated(address)` - Check if user has donated
- `canUserVote(address)` - Check if user can vote
- `canUserClaimRefund(address)` - Check if user can claim refund
- `canCreatorClaimFunds(address)` - Check if creator can claim funds
- `isCampaignActive(address)` - Check if campaign is active
- `isCampaignInVoting(address)` - Check if campaign is in voting phase

**Utility Functions:**
- `formatUSDC(amount)` - Format BigInt to USDC string
- `parseUSDC(amount)` - Parse USDC string to BigInt
- `getCampaignStateString(state)` - Convert state number to string
- `getVotingProgress(address)` - Get voting progress percentage
- `getFundingProgress(address)` - Get funding progress percentage

**Usage:**
```tsx
import { useTuCausa } from "@/hooks/use-tucausa"

function CampaignDashboard({ campaignAddress }) {
  const {
    // User state
    address,
    isConnected,
    
    // Factory methods
    campaigns,
    createNewCampaign,
    
    // USDC methods
    balance,
    approveSpending,
    
    // Helper functions
    getCampaign,
    isCampaignCreator,
    formatUSDC,
    getFundingProgress,
    
    // Loading states
    isLoadingCampaigns,
    isCreating,
  } = useTuCausa()

  const campaign = getCampaign(campaignAddress)
  const isCreator = isCampaignCreator(campaignAddress)
  const fundingProgress = getFundingProgress(campaignAddress)

  return (
    <div>
      <h1>Campaign Dashboard</h1>
      <p>Your Balance: {formatUSDC(balance)} USDC</p>
      <p>Funding Progress: {fundingProgress}%</p>
      {isCreator && <p>You are the creator!</p>}
    </div>
  )
}
```

## 📋 Contract Addresses

The hooks automatically use the correct contract addresses based on the current network:

```typescript
// Sepolia Testnet
CAMPAIGN_FACTORY_ADDRESS = "0x5969BFB1229ed461A4f9A163B548D30cdFfEdB59"
USDC_ADDRESS = "0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238"

// Base Mainnet (to be deployed)
CAMPAIGN_FACTORY_ADDRESS = "0x..."
USDC_ADDRESS = "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913"
```

## 🎨 Example Components

### Campaign Card Component
```tsx
import { CampaignCard } from "@/components/campaign-card"

function CampaignsList() {
  const { campaigns } = useTuCausa()
  
  return (
    <div className="grid gap-4">
      {campaigns?.map(address => (
        <CampaignCard key={address} campaignAddress={address} />
      ))}
    </div>
  )
}
```

### Create Campaign Form
```tsx
import { CreateCampaignForm } from "@/components/create-campaign-form"

function CreatePage() {
  return (
    <div className="container mx-auto p-4">
      <CreateCampaignForm />
    </div>
  )
}
```

## 🔄 State Management

All hooks use Wagmi's built-in state management:
- **Automatic caching** - Data is cached and shared across components
- **Real-time updates** - Data updates when transactions are confirmed
- **Loading states** - Built-in loading indicators for all operations
- **Error handling** - Automatic error handling and retry logic

## 🛠️ Best Practices

1. **Use the comprehensive hook** - `useTuCausa()` provides all functionality
2. **Check connection state** - Always verify `isConnected` before writing
3. **Handle loading states** - Use loading indicators for better UX
4. **Format amounts properly** - Use `formatUSDC()` and `parseUSDC()` for amounts
5. **Check permissions** - Use helper functions to check user permissions

## 🚨 Important Notes

- **USDC Decimals**: USDC uses 6 decimals (not 18 like most ERC20 tokens)
- **BigInt Usage**: All amounts are returned as BigInt for precision
- **Network Support**: Currently supports Sepolia and Base networks
- **Wallet Connection**: Users must connect their wallet to interact with contracts

## 📚 Additional Resources

- [Wagmi Documentation](https://wagmi.sh/)
- [Viem Documentation](https://viem.sh/)
- [Contract ABIs](./lib/contracts.ts)
- [Contract Addresses](./lib/contracts.ts)
