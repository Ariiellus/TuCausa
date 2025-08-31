# TuCausa 🌟

> **Transparent Local Fundraising on Base Blockchain**

[![Deployed on Base](https://img.shields.io/badge/Deployed%20on-Base%20Mainnet-0052FF?style=for-the-badge&logo=ethereum)](https://basescan.org/address/0xe46c683691aD993133CdE2A0cc19cCae724fE93d)
[![Frontend](https://img.shields.io/badge/Frontend-Next.js%2015-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![Smart Contracts](https://img.shields.io/badge/Smart%20Contracts-Foundry-orange?style=for-the-badge&logo=solidity)](https://getfoundry.sh/)

---

## 🎯 The Problem

Local communities struggle with:
- **Lack of transparency** in traditional fundraising
- **High fees** from centralized platforms
- **Limited trust** between donors and cause creators
- **No accountability** for fund usage
- **Geographic barriers** to community support

## 💡 The Solution

TuCausa is a **decentralized fundraising platform** that empowers communities to create and support local causes with complete transparency using USDC on Base blockchain.

### Key Innovations:
- **🔍 Community Verification**: Donors vote on proof of completion
- **💰 Transparent Tracking**: All transactions recorded on-chain
- **🌍 Local Focus**: ENS subdomains for community identity
- **⚡ Low-Cost**: Built on Base for minimal gas fees
- **🛡️ Trustless**: Smart contracts ensure fair fund distribution

---

## ✨ Features

### For Cause Creators
- 🚀 **Easy Campaign Creation**: Simple form with ENS subdomain
- 📊 **Real-time Progress**: Live funding updates and donor count
- 📝 **Proof Submission**: Upload evidence of completed work
- 💸 **Automatic Payout**: Smart contract releases funds upon approval

### For Donors
- 🗳️ **Voting Power**: Vote on proof of completion
- 🔍 **Complete Transparency**: View all transactions on BaseScan
- 💰 **Refund Protection**: Get refunds if cause fails verification
- 🌐 **Community Impact**: Support local initiatives directly

### Platform Features
- 🌍 **Bilingual Support**: English and Spanish
- 📱 **Mobile Optimized**: Responsive design for all devices
- 🔐 **Wallet Integration**: Coinbase Wallet and WalletConnect
- 🌐 **ENS Integration**: Display ENS names and avatars
- ⚡ **Fast Transactions**: Built on Base for optimal performance

---

## 🏗️ Architecture

### Smart Contracts
```
CampaignFactory (0xe46c683691aD993133CdE2A0cc19cCae724fE93d)
├── Creates Campaign contracts
├── Tracks all campaigns
└── Manages USDC integration

Campaign (Individual contracts)
├── Stores campaign data
├── Handles donations
├── Manages voting system
├── Controls fund distribution
└── Processes refunds
```

### Frontend Architecture
```
Next.js 15 App Router
├── Server Components (SSR)
├── Client Components (Interactivity)
├── Wagmi Integration (Web3)
├── Tailwind CSS (Styling)
└── next-international (i18n)
```

### Tech Stack
- **Frontend**: Next.js 15, React 18, TypeScript, Tailwind CSS
- **Blockchain**: Foundry, Solidity 0.8.29, Base Network
- **Web3**: Wagmi, Viem, Coinbase Wallet, WalletConnect
- **Deployment**: Vercel (Frontend), BaseScan (Contracts)
- **Internationalization**: next-international

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Foundry (for smart contracts)
- Coinbase Wallet or WalletConnect
- Base network access

### Frontend Development

```bash
# Clone the repository
git clone https://github.com/yourusername/tucausa.git
cd tucausa/front

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

# Deploy to Base Mainnet
forge script Deploy --rpc-url https://mainnet.base.org --broadcast --verify --chain-id 8453
```

### Environment Setup

1. **Frontend Environment** (`front/.env.local`):
```env
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
NEXT_PUBLIC_REOWN_PROJECT_ID=your_reown_project_id
```

2. **Smart Contract Environment** (`foundry/.env`):
```env
PRIVATE_KEY=your_deployment_private_key
BASE_RPC_URL=https://mainnet.base.org
BASESCAN_API_KEY=your_basescan_api_key
```

---

## 📊 Contract Addresses

### Base Mainnet
- **CampaignFactory**: [`0xe46c683691aD993133CdE2A0cc19cCae724fE93d`](https://basescan.org/address/0xe46c683691aD993133CdE2A0cc19cCae724fE93d)
- **USDC**: [`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`](https://basescan.org/token/0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913)

---

## 🔄 How It Works

### 1. Campaign Creation
```
Creator → CampaignFactory → New Campaign Contract
├── Sets goal amount in USDC
├── Defines ENS subdomain
└── Establishes voting parameters
```

### 2. Donation Phase
```
Donors → Campaign Contract → USDC Transfer
├── Approve USDC spending
├── Donate to campaign
└── Receive voting rights
```

### 3. Proof Submission
```
Creator → Campaign Contract → Proof URI
├── Upload evidence of completion
├── Trigger voting period
└── Lock campaign for review
```

### 4. Community Voting
```
Donors → Campaign Contract → Vote
├── Review submitted proof
├── Vote on completion
└── Determine fund release
```

### 5. Fund Distribution
```
Smart Contract → Automatic Distribution
├── Release funds to creator (if approved)
├── Refund donors (if rejected)
└── Record all transactions on-chain
```

---

## 🧪 Testing

### Smart Contract Tests
```bash
cd foundry
forge test
```

### Frontend Tests
```bash
cd front
npm run test
```

### Integration Tests
```bash
# Test campaign creation flow
npm run test:integration
```

---

## 📈 Roadmap

### Phase 1: Core Platform ✅
- [x] Smart contract deployment on Base
- [x] Basic campaign creation and donation
- [x] Community voting system
- [x] Fund distribution mechanism

### Phase 2: Enhanced Features 🚧
- [ ] Advanced analytics dashboard
- [ ] Social media integration
- [ ] Mobile app development
- [ ] Multi-chain support

### Phase 3: Ecosystem Growth 📋
- [ ] DAO governance
- [ ] Grant programs
- [ ] Community partnerships
- [ ] Educational resources

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Standards
- TypeScript for type safety
- Solidity best practices
- Comprehensive testing
- Documentation updates

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌟 Support

- **Documentation**: [docs.tucausa.eth](https://docs.tucausa.eth)
- **Discord**: [Join our community](https://discord.gg/tucausa)
- **Twitter**: [@TuCausa](https://twitter.com/TuCausa)
- **Email**: hello@tucausa.eth

---

## 🙏 Acknowledgments

- Base team for the excellent L2 infrastructure
- Coinbase for wallet integration
- OpenZeppelin for secure smart contract libraries
- Next.js team for the amazing framework

---

**Built with ❤️ for local communities everywhere**
