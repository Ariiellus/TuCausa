// SPDX-License-Identifier: MIT
pragma solidity ^0.8.29;

import {IERC20} from "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import {ReentrancyGuard} from "@openzeppelin/contracts/security/ReentrancyGuard.sol";

contract Campaign is ReentrancyGuard {
    enum CampaignState { Active, UnderReview, Completed, Refunded }
    
    string public title;
    string public description;
    uint256 public goalAmount;
    uint256 public totalRaised;
    address public creator;
    IERC20 public usdcToken;
    string public ensSubdomain;
    string public proofURI;
    CampaignState public state;
    
    mapping(address => uint256) public donations;
    mapping(address => bool) public hasVoted;
    address[] public donors;
    uint256 public votesForSolved;
    uint256 public votesForNotSolved;
    
    uint256 public constant VOTING_THRESHOLD = 60; // 60% approval needed
    uint256 public constant VOTING_PERIOD = 7 days;
    uint256 public votingStartTime;
    
    event DonationReceived(address indexed donor, uint256 amount);
    event ProofSubmitted(string proofURI);
    event VoteCast(address indexed voter, bool solved);
    event FundsReleased(address indexed creator, uint256 amount);
    event RefundClaimed(address indexed donor, uint256 amount);
    
    modifier onlyCreator() {
        require(msg.sender == creator, "Only creator can call this");
        _;
    }
    
    modifier onlyDonors() {
        require(donations[msg.sender] > 0, "Only donors can vote");
        _;
    }
    
    constructor(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        address _creator,
        address _usdcToken,
        string memory _ensSubdomain
    ) {
        title = _title;
        description = _description;
        goalAmount = _goalAmount;
        creator = _creator;
        usdcToken = IERC20(_usdcToken);
        ensSubdomain = _ensSubdomain;
        state = CampaignState.Active;
    }
    
    function donate(uint256 _amount) external nonReentrant {
        require(state == CampaignState.Active, "Campaign not active");
        require(_amount > 0, "Amount must be greater than 0");
        
        // Transfer USDC from donor to this contract
        require(
            usdcToken.transferFrom(msg.sender, address(this), _amount),
            "USDC transfer failed"
        );
        
        // Track donation
        if (donations[msg.sender] == 0) {
            donors.push(msg.sender);
        }
        donations[msg.sender] += _amount;
        totalRaised += _amount;
        
        emit DonationReceived(msg.sender, _amount);
    }
    
    function submitProof(string memory _proofURI) external onlyCreator {
        require(state == CampaignState.Active, "Campaign not active");
        require(totalRaised > 0, "No donations received");
        
        proofURI = _proofURI;
        state = CampaignState.UnderReview;
        votingStartTime = block.timestamp;
        
        emit ProofSubmitted(_proofURI);
    }
    
    function vote(bool _solved) external onlyDonors {
        require(state == CampaignState.UnderReview, "Not in review phase");
        require(!hasVoted[msg.sender], "Already voted");
        require(
            block.timestamp <= votingStartTime + VOTING_PERIOD,
            "Voting period ended"
        );
        
        hasVoted[msg.sender] = true;
        
        if (_solved) {
            votesForSolved++;
        } else {
            votesForNotSolved++;
        }
        
        emit VoteCast(msg.sender, _solved);
        
        // Check if voting is complete
        _checkVotingResult();
    }
    
    function _checkVotingResult() internal {
        uint256 totalVotes = votesForSolved + votesForNotSolved;
        uint256 totalDonors = donors.length;
        
        // If all donors voted or voting period ended
        if (totalVotes == totalDonors || 
            block.timestamp > votingStartTime + VOTING_PERIOD) {
            
            uint256 approvalPercentage = (votesForSolved * 100) / totalDonors;
            
            if (approvalPercentage >= VOTING_THRESHOLD) {
                state = CampaignState.Completed;
            } else {
                state = CampaignState.Refunded;
            }
        }
    }
    
    function claimFunds() external onlyCreator nonReentrant {
        require(state == CampaignState.Completed, "Campaign not completed");
        
        uint256 amount = totalRaised;
        totalRaised = 0;
        
        require(usdcToken.transfer(creator, amount), "Transfer failed");
        
        emit FundsReleased(creator, amount);
    }
    
    function claimRefund() external nonReentrant {
        require(state == CampaignState.Refunded, "Refunds not available");
        require(donations[msg.sender] > 0, "No donation to refund");
        
        uint256 amount = donations[msg.sender];
        donations[msg.sender] = 0;
        
        require(usdcToken.transfer(msg.sender, amount), "Refund failed");
        
        emit RefundClaimed(msg.sender, amount);
    }
    
    function getDonorCount() external view returns (uint256) {
        return donors.length;
    }
    
    function getVotingStatus() external view returns (
        uint256 _votesForSolved,
        uint256 _votesForNotSolved,
        uint256 _totalDonors,
        uint256 _timeRemaining
    ) {
        _votesForSolved = votesForSolved;
        _votesForNotSolved = votesForNotSolved;
        _totalDonors = donors.length;
        
        if (block.timestamp >= votingStartTime + VOTING_PERIOD) {
            _timeRemaining = 0;
        } else {
            _timeRemaining = (votingStartTime + VOTING_PERIOD) - block.timestamp;
        }
    }
}
