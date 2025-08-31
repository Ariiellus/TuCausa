// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import "./Campaign.sol";

contract CampaignFactory {
    address[] public campaigns;
    address public immutable usdcToken;
    
    event CampaignCreated(
        address indexed campaignAddress,
        address indexed creator,
        string title,
        string ensSubdomain
    );
    
    constructor(address _usdcToken) {
        usdcToken = _usdcToken;
    }
    
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        string memory _ensSubdomain
    ) external returns (address) {
        Campaign newCampaign = new Campaign(
            _title,
            _description,
            _goalAmount,
            msg.sender,
            usdcToken,
            _ensSubdomain
        );
        
        campaigns.push(address(newCampaign));
        
        emit CampaignCreated(
            address(newCampaign),
            msg.sender,
            _title,
            _ensSubdomain
        );
        
        return address(newCampaign);
    }
    
    function getAllCampaigns() external view returns (address[] memory) {
        return campaigns;
    }
    
    function getCampaignCount() external view returns (uint256) {
        return campaigns.length;
    }
}
