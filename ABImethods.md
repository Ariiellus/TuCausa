# Contract ABI Methods

## CampaignFactory Contract Methods

| Method | Identifier |
|--------|------------|
| `campaigns(uint256)` | `141961bc` |
| `createCampaign(string,string,uint256,string)` | `36d4ae71` |
| `getAllCampaigns()` | `86cdf604` |
| `getCampaignCount()` | `6caa9218` |
| `usdcToken()` | `11eac855` |

## Campaign Contract Methods

| Method | Identifier |
|--------|------------|
| `VOTING_PERIOD()` | `b1610d7e` |
| `VOTING_THRESHOLD()` | `94abb8cd` |
| `claimFunds()` | `ac307773` |
| `claimRefund()` | `b5545a3c` |
| `creator()` | `02d05d3f` |
| `description()` | `7284e416` |
| `donate(uint256)` | `f14faf6f` |
| `donations(address)` | `cc6cb19a` |
| `donors(uint256)` | `4abfa163` |
| `ensSubdomain()` | `9438c804` |
| `getDonorCount()` | `69bc2f1e` |
| `getVotingStatus()` | `581c281c` |
| `goalAmount()` | `2636b945` |
| `hasVoted(address)` | `09eef43e` |
| `proofURI()` | `47d2ce55` |
| `state()` | `c19d93fb` |
| `submitProof(string)` | `2c2e8faf` |
| `title()` | `4a79d50c` |
| `totalRaised()` | `c5c4744c` |
| `usdcToken()` | `11eac855` |
| `vote(bool)` | `4b9f5c98` |
| `votesForNotSolved()` | `787bfe1e` |
| `votesForSolved()` | `f436bd0c` |
| `votingStartTime()` | `2019a608` |

## Notes

- **CampaignFactory**: Factory contract for creating new campaigns
- **Campaign**: Individual campaign contract with donation and voting functionality
- **Identifiers**: Function selectors (first 4 bytes of the keccak256 hash of the function signature) 

