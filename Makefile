# Include environment variables from .env file
include .env
export

.PHONY: all clean build format deploy-sepolia deploy-base verify verify-status test anvil install update help

all: clean build test

# ----- Limpieza -----
clean:
	@echo "Cleaning build artifacts..."
	cd foundry && rm -rf out cache

# ----- Build / Format -----
build:
	@echo "Building contracts..."
	cd foundry && forge build

format:
	@echo "Formatting code..."
	cd foundry && forge fmt

# ----- Deploy -----
deploy-sepolia:
	@echo "Deploying TuCausa contracts to Sepolia..."
	cd foundry && forge script script/Deploy.s.sol \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--broadcast \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--compiler-version 0.8.30 \
		--private-key $(PRIVATE_KEY) \
		--skip-simulation

deploy-base:
	@echo "Deploying TuCausa contracts to Base Mainnet..."
	cd foundry && forge script script/Deploy.s.sol \
		--rpc-url $(BASE_RPC_URL) \
		--broadcast \
		--etherscan-api-key $(BASESCAN_API_KEY) \
		--compiler-version 0.8.30 \
		--private-key $(PRIVATE_KEY) \
		--skip-simulation

# ----- Verify -----
# Uso: make verify CONTRACT=0x... CONTRACT_NAME=CampaignFactory
verify:
	@if [ -z "$(CONTRACT)" ]; then echo "Falta CONTRACT=<address>"; exit 1; fi
	@if [ -z "$(CONTRACT_NAME)" ]; then echo "Falta CONTRACT_NAME=<name>"; exit 1; fi
	@echo "Flattening contract for verification..."; \
	cd foundry && forge flatten src/$(CONTRACT_NAME).sol > flattened_$(CONTRACT_NAME).sol; \
	echo "Verifying $(CONTRACT) with flattened_$(CONTRACT_NAME).sol:$(CONTRACT_NAME)"; \
	forge verify-contract \
		--rpc-url $(SEPOLIA_RPC_URL) \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--compiler-version 0.8.30 \
		$(CONTRACT) \
		flattened_$(CONTRACT_NAME).sol:$(CONTRACT_NAME) \
		--constructor-args 0000000000000000000000001c7d4b196cb0c7b01d743fbc6116a902379c7238

# Consultar estado de verificación
# Uso: make verify-status GUID=vtix...
verify-status:
	@if [ -z "$(GUID)" ]; then echo "Falta GUID=<etherscan_guid>"; exit 1; fi
	cd foundry && forge verify-check \
		--etherscan-api-key $(ETHERSCAN_API_KEY) \
		--guid $(GUID)

# ----- Tests -----
test:
	@echo "Running tests..."
	cd foundry && forge test -vvv

# ----- Anvil -----
anvil:
	@echo "Starting local Anvil node..."
	anvil

# ----- Dependencias -----
install:
	@echo "Installing dependencies..."
	cd foundry && forge install

update:
	@echo "Updating dependencies..."
	cd foundry && forge update

# ----- Help -----
help:
	@echo "Available commands:"
	@echo "  make build                 Build contracts"
	@echo "  make test                  Run tests"
	@echo "  make format                Format code"
	@echo "  make deploy-sepolia        Deploy to Sepolia testnet"
	@echo "  make deploy-base           Deploy to Base Mainnet"
	@echo "  make verify CONTRACT=... CONTRACT_NAME=...    Verify contract on Sepolia"
	@echo "  make verify-status GUID=...                    Check Etherscan verification status"
	@echo "  make anvil                 Start local anvil"
	@echo "  make clean                 Clean build artifacts"
	@echo "  make install               Install dependencies"
	@echo "  make update                Update dependencies"
