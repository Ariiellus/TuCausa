// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {Script} from "forge-std/Script.sol";
import {console} from "forge-std/console.sol";

contract HelperConfig is Script {
    struct NetworkConfig {
        uint256 deployerKey;
        string rpcUrl;
        string etherscanApiKey;
        uint256 chainId;
    }

    NetworkConfig public activeNetworkConfig;

    constructor() {
        if (block.chainid == 11155111) {
            // Sepolia
            activeNetworkConfig = getSepoliaNetworkConfig();
        } else if (block.chainid == 8453) {
            // Base Mainnet
            activeNetworkConfig = getBaseMainnetNetworkConfig();
        }
    }

    function getSepoliaNetworkConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            deployerKey: vm.envUint("PRIVATE_KEY"),
            rpcUrl: vm.envString("SEPOLIA_RPC_URL"),
            etherscanApiKey: vm.envString("ETHERSCAN_API_KEY"),
            chainId: 11155111
        });
    }

    function getBaseMainnetNetworkConfig() public view returns (NetworkConfig memory) {
        return NetworkConfig({
            deployerKey: vm.envUint("PRIVATE_KEY"),
            rpcUrl: vm.envString("BASE_RPC_URL"),
            etherscanApiKey: vm.envString("BASESCAN_API_KEY"),
            chainId: 8453
        });
    }
}