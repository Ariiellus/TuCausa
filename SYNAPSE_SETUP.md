# Synapse Configuration Guide

## Overview
Synapse is a decentralized storage solution built on Filecoin. This guide will help you configure real Synapse uploads instead of using the mock system.

## Prerequisites ✅ COMPLETED

### 1. Filecoin Wallet ✅
You have a Filecoin wallet with FIL tokens in calibration testnet.

### 2. Testnet FIL ✅
You have FIL tokens in the calibration testnet.

## Environment Configuration

### 1. Create/Update `.env` file
Create a `.env` file in your `front/` directory:

```env
# Synapse Configuration
PRIVATE_KEY=your_filecoin_private_key_here

# Custom RPC URL for Filecoin Calibration Testnet
SYNAPSE_RPC_URL=https://lb.drpc.org/filecoin-calibration/AlTN9SDQJUl9nsiNhjqoqNszocJhevIR8IwxIgaNGuYu

# App Configuration
NEXT_PUBLIC_CHAIN_ID=8453
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id
```

### 2. Private Key Format
Your private key should be:
- **Hex format** (0x prefix)
- **64 characters** (32 bytes)
- **Example**: `0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef`

### 3. Security Notes
- ⚠️ **Never commit your `.env` file to git**
- ⚠️ **Keep your private key secure**
- ⚠️ **Use testnet keys for development**

## Testing Configuration

### 1. Check Environment Variables
The API will log whether your environment variables are set correctly:

```bash
# Start the development server
npm run dev
```

### 2. Upload a Test File
Try uploading a small test file and check the console logs for:
- ✅ Environment check shows `hasPrivateKey: true`
- ✅ Environment check shows `hasCustomRpc: true`
- ✅ Synapse initialization success
- ✅ Storage service creation
- ✅ File upload completion

### 3. Verify Upload
After successful upload, you should see:
- Real commp (not starting with `mock_`)
- Synapse URL format: `https://synapse.filoz.org/retrieve/[commp]`

## Troubleshooting

### Common Issues

**1. "Private key not configured"**
- Check that `.env` file exists in `front/` directory
- Verify `PRIVATE_KEY` variable is set
- Restart the development server

**2. "Synapse initialization failed"**
- Verify private key format (64 hex characters)
- Check network connectivity to your RPC URL
- Ensure you have testnet FIL

**3. "Upload failed"**
- Check Filecoin wallet balance
- Verify RPC endpoint is accessible
- Check file size (should be reasonable)

### Debug Steps

1. **Check Environment Variables**
```bash
# In your API route, you'll see logs like:
Environment check: {
  hasPrivateKey: true,
  privateKeyLength: 66, // 0x + 64 chars
  nodeEnv: 'development',
  hasCustomRpc: true
}
```

2. **Check Synapse Initialization**
```bash
# Should see:
"Using RPC URL: https://lb.drpc.org/filecoin-calibration/AlTN9SDQJUl9nsiNhjqoqNszocJhevIR8IwxIgaNGuYu"
"Initializing Synapse with private key..."
"Synapse created successfully"
"Creating storage service..."
"Storage service created successfully"
```

3. **Check Upload Process**
```bash
# Should see:
"Converting file to Uint8Array..."
"File converted, size: [number]"
"Uploading to Filecoin via Synapse..."
"Upload successful: [commp]"
```

## Production Deployment

### Vercel Deployment
1. Add environment variables in Vercel dashboard
2. Set `PRIVATE_KEY` to your production Filecoin private key
3. Use mainnet RPC URL for production

### Environment Variables in Vercel
```env
PRIVATE_KEY=your_production_private_key
SYNAPSE_RPC_URL=https://lb.drpc.org/filecoin/AlTN9SDQJUl9nsiNhjqoqNszocJhevIR8IwxIgaNGuYu
NODE_ENV=production
```

## Network Options

### Testnet (Development) ✅ YOUR SETUP
- **Network**: Calibration Testnet
- **RPC URL**: `https://lb.drpc.org/filecoin-calibration/AlTN9SDQJUl9nsiNhjqoqNszocJhevIR8IwxIgaNGuYu`
- **FIL**: ✅ You have testnet FIL

### Mainnet (Production)
- **Network**: Filecoin Mainnet
- **RPC URL**: `https://lb.drpc.org/filecoin/AlTN9SDQJUl9nsiNhjqoqNszocJhevIR8IwxIgaNGuYu`
- **FIL**: Real FIL required

## Security Best Practices

1. **Use different keys for development and production**
2. **Never expose private keys in client-side code**
3. **Use environment variables for all sensitive data**
4. **Regularly rotate private keys**
5. **Monitor wallet balances**

## Support

If you encounter issues:
1. Check the console logs for detailed error messages
2. Verify your Filecoin wallet has sufficient balance
3. Test with a small file first
4. Check network connectivity to Filecoin RPC endpoints
