// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {Script, console} from "forge-std/Script.sol";
import {CampaignFactory} from "../src/CampaignFactory.sol";
import {HelperConfig} from "./HelperConfig.sol";

contract DeployScript is Script {
    function run() external {
        HelperConfig helperConfig = new HelperConfig();
        (uint256 deployerKey, , , ) = helperConfig.activeNetworkConfig();
        address deployer = vm.addr(deployerKey);
        
        console.log("Deploying to chain ID:", block.chainid);
        console.log("Deployer address:", deployer);
        
        vm.startBroadcast(deployerKey);
        
        // Determine USDC address based on network
        address usdcAddress;
        if (block.chainid == 11155111) {
            // Sepolia - use real USDC
            usdcAddress = 0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238;
            console.log("Using Sepolia USDC:", usdcAddress);
        } else if (block.chainid == 8453) {
            // Base Mainnet - use real USDC
            usdcAddress = 0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913;
            console.log("Using Base USDC:", usdcAddress);
        } else {
            revert("Unsupported network. Only Sepolia (11155111) and Base (8453) are supported.");
        }
        
        // Deploy CampaignFactory
        CampaignFactory factory = new CampaignFactory(usdcAddress);
        console.log("CampaignFactory deployed at:", address(factory));
        
        vm.stopBroadcast();
        
        console.log("Deployment completed!");
        console.log("USDC Address:", usdcAddress);
        console.log("CampaignFactory:", address(factory));
    }
}
