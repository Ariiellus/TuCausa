// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

/// @notice Minimal IERC20 to match your Campaign imports
interface IERC20 {
  function totalSupply() external view returns (uint256);
  function balanceOf(address account) external view returns (uint256);
  function allowance(address owner, address spender) external view returns (uint256);
  function transfer(address to, uint256 amount) external returns (bool);
  function approve(address spender, uint256 amount) external returns (bool);
  function transferFrom(address from, address to, uint256 amount) external returns (bool);
  event Transfer(address indexed from, address indexed to, uint256 value);
  event Approval(address indexed owner, address indexed spender, uint256 value);
}

/// @title MockUSDC
/// @notice Mintable ERC20 with 6 decimals; no fees, no hooks.
contract MockUSDC is IERC20 {
  string public name = "Mock USDC";
  string public symbol = "mUSDC";
  uint8  public decimals = 6;

  uint256 public override totalSupply;
  mapping(address => uint256) public override balanceOf;
  mapping(address => mapping(address => uint256)) public override allowance;

  function mint(address to, uint256 amount) external {
    totalSupply += amount;
    balanceOf[to] += amount;
    emit Transfer(address(0), to, amount);
  }

  function burn(address from, uint256 amount) external {
    require(balanceOf[from] >= amount, "BAL_LOW");
    if (msg.sender != from) {
      uint256 a = allowance[from][msg.sender];
      require(a >= amount, "ALLOW_LOW");
      unchecked { allowance[from][msg.sender] = a - amount; }
      emit Approval(from, msg.sender, allowance[from][msg.sender]);
    }
    unchecked {
      balanceOf[from] -= amount;
      totalSupply -= amount;
    }
    emit Transfer(from, address(0), amount);
  }

  function approve(address spender, uint256 amount) external override returns (bool) {
    allowance[msg.sender][spender] = amount;
    emit Approval(msg.sender, spender, amount);
    return true;
  }

  function transfer(address to, uint256 amount) external override returns (bool) {
    _transfer(msg.sender, to, amount);
    return true;
  }

  function transferFrom(address from, address to, uint256 amount) external override returns (bool) {
    uint256 a = allowance[from][msg.sender];
    require(a >= amount, "ALLOW_LOW");
    unchecked { allowance[from][msg.sender] = a - amount; }
    emit Approval(from, msg.sender, allowance[from][msg.sender]);
    _transfer(from, to, amount);
    return true;
  }

  function _transfer(address from, address to, uint256 amount) internal {
    require(to != address(0), "TO_ZERO");
    uint256 bal = balanceOf[from];
    require(bal >= amount, "BAL_LOW");
    unchecked {
      balanceOf[from] = bal - amount;
      balanceOf[to] += amount;
    }
    emit Transfer(from, to, amount);
  }
}
