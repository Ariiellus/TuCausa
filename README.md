# TuCausa - Fundraise for Local Causes

A decentralized platform for creating and funding local causes using USDC on Base blockchain.

## Project Structure

This is a monorepo containing:

- **`front/`** - Next.js frontend application
- **`foundry/`** - Smart contracts and deployment scripts

## Quick Start

### Frontend Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

### Smart Contract Development

```bash
# Navigate to foundry directory
cd foundry

# Install dependencies
forge install

# Build contracts
forge build

# Run tests
forge test

# Deploy contracts
forge script Deploy --rpc-url $RPC_URL --broadcast --verify
```

## Environment Setup

1. Copy `.env.example` to `.env.local` in the `front/` directory
2. Add your environment variables:
   - `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID`
   - `NEXT_PUBLIC_REOWN_PROJECT_ID` (if using Reown)

## Features

- 🌐 **Internationalization** - English and Spanish support
- 🔐 **Wallet Integration** - Coinbase Wallet and WalletConnect
- 📱 **Mobile Optimized** - Responsive design
- 🌐 **ENS Integration** - Display ENS names and avatars
- 🔒 **Smart Contracts** - Transparent fundraising on Base

## Tech Stack

- **Frontend**: Next.js 15, React, TypeScript, Tailwind CSS
- **Blockchain**: Foundry, Solidity, Base Network
- **Wallet**: Wagmi, Coinbase Wallet, WalletConnect
- **Internationalization**: next-international
