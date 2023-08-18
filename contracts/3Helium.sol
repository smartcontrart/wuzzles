// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract ThreeHelium is ERC20 {
    mapping(address => bool) isAdmin;

    error Unauthorized();

    constructor() ERC20("3-Helium", "3He") {
        isAdmin[msg.sender] = true;
    }

    modifier adminRequired() {
        if (!isAdmin[msg.sender]) revert Unauthorized();
        _;
    }

    function mint(address _to, uint256 _amount) external adminRequired {
        _mint(_to, _amount);
    }

    function burn(uint256 amount) external {
        _burn(msg.sender, amount);
    }
}
