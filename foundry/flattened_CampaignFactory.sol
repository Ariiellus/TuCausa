// SPDX-License-Identifier: MIT
pragma solidity >=0.4.16 ^0.8.20 ^0.8.29;

// lib/openzeppelin-contracts/contracts/token/ERC20/IERC20.sol

// OpenZeppelin Contracts (last updated v5.4.0) (token/ERC20/IERC20.sol)

/**
 * @dev Interface of the ERC-20 standard as defined in the ERC.
 */
interface IERC20 {
    /**
     * @dev Emitted when `value` tokens are moved from one account (`from`) to
     * another (`to`).
     *
     * Note that `value` may be zero.
     */
    event Transfer(address indexed from, address indexed to, uint256 value);

    /**
     * @dev Emitted when the allowance of a `spender` for an `owner` is set by
     * a call to {approve}. `value` is the new allowance.
     */
    event Approval(address indexed owner, address indexed spender, uint256 value);

    /**
     * @dev Returns the value of tokens in existence.
     */
    function totalSupply() external view returns (uint256);

    /**
     * @dev Returns the value of tokens owned by `account`.
     */
    function balanceOf(address account) external view returns (uint256);

    /**
     * @dev Moves a `value` amount of tokens from the caller's account to `to`.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transfer(address to, uint256 value) external returns (bool);

    /**
     * @dev Returns the remaining number of tokens that `spender` will be
     * allowed to spend on behalf of `owner` through {transferFrom}. This is
     * zero by default.
     *
     * This value changes when {approve} or {transferFrom} are called.
     */
    function allowance(address owner, address spender) external view returns (uint256);

    /**
     * @dev Sets a `value` amount of tokens as the allowance of `spender` over the
     * caller's tokens.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * IMPORTANT: Beware that changing an allowance with this method brings the risk
     * that someone may use both the old and the new allowance by unfortunate
     * transaction ordering. One possible solution to mitigate this race
     * condition is to first reduce the spender's allowance to 0 and set the
     * desired value afterwards:
     * https://github.com/ethereum/EIPs/issues/20#issuecomment-263524729
     *
     * Emits an {Approval} event.
     */
    function approve(address spender, uint256 value) external returns (bool);

    /**
     * @dev Moves a `value` amount of tokens from `from` to `to` using the
     * allowance mechanism. `value` is then deducted from the caller's
     * allowance.
     *
     * Returns a boolean value indicating whether the operation succeeded.
     *
     * Emits a {Transfer} event.
     */
    function transferFrom(address from, address to, uint256 value) external returns (bool);
}

// lib/openzeppelin-contracts/contracts/utils/ReentrancyGuard.sol

// OpenZeppelin Contracts (last updated v5.1.0) (utils/ReentrancyGuard.sol)

/**
 * @dev Contract module that helps prevent reentrant calls to a function.
 *
 * Inheriting from `ReentrancyGuard` will make the {nonReentrant} modifier
 * available, which can be applied to functions to make sure there are no nested
 * (reentrant) calls to them.
 *
 * Note that because there is a single `nonReentrant` guard, functions marked as
 * `nonReentrant` may not call one another. This can be worked around by making
 * those functions `private`, and then adding `external` `nonReentrant` entry
 * points to them.
 *
 * TIP: If EIP-1153 (transient storage) is available on the chain you're deploying at,
 * consider using {ReentrancyGuardTransient} instead.
 *
 * TIP: If you would like to learn more about reentrancy and alternative ways
 * to protect against it, check out our blog post
 * https://blog.openzeppelin.com/reentrancy-after-istanbul/[Reentrancy After Istanbul].
 */
abstract contract ReentrancyGuard {
    // Booleans are more expensive than uint256 or any type that takes up a full
    // word because each write operation emits an extra SLOAD to first read the
    // slot's contents, replace the bits taken up by the boolean, and then write
    // back. This is the compiler's defense against contract upgrades and
    // pointer aliasing, and it cannot be disabled.

    // The values being non-zero value makes deployment a bit more expensive,
    // but in exchange the refund on every call to nonReentrant will be lower in
    // amount. Since refunds are capped to a percentage of the total
    // transaction's gas, it is best to keep them low in cases like this one, to
    // increase the likelihood of the full refund coming into effect.
    uint256 private constant NOT_ENTERED = 1;
    uint256 private constant ENTERED = 2;

    uint256 private _status;

    /**
     * @dev Unauthorized reentrant call.
     */
    error ReentrancyGuardReentrantCall();

    constructor() {
        _status = NOT_ENTERED;
    }

    /**
     * @dev Prevents a contract from calling itself, directly or indirectly.
     * Calling a `nonReentrant` function from another `nonReentrant`
     * function is not supported. It is possible to prevent this from happening
     * by making the `nonReentrant` function external, and making it call a
     * `private` function that does the actual work.
     */
    modifier nonReentrant() {
        _nonReentrantBefore();
        _;
        _nonReentrantAfter();
    }

    function _nonReentrantBefore() private {
        // On the first call to nonReentrant, _status will be NOT_ENTERED
        if (_status == ENTERED) {
            revert ReentrancyGuardReentrantCall();
        }

        // Any calls to nonReentrant after this point will fail
        _status = ENTERED;
    }

    function _nonReentrantAfter() private {
        // By storing the original value once again, a refund is triggered (see
        // https://eips.ethereum.org/EIPS/eip-2200)
        _status = NOT_ENTERED;
    }

    /**
     * @dev Returns true if the reentrancy guard is currently set to "entered", which indicates there is a
     * `nonReentrant` function in the call stack.
     */
    function _reentrancyGuardEntered() internal view returns (bool) {
        return _status == ENTERED;
    }
}

// src/Campaign.sol

  

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
    uint256 public constant VOTING_PERIOD = 5 minutes; // for testing
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

// src/CampaignFactory.sol

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

