// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import '@openzeppelin/contracts/token/ERC20/ERC20.sol';

contract Token is ERC20 {
    address public minter;

    // Emit event that the minter has changed
    event MinterChanged(address indexed from, address to);

    constructor() ERC20("Kitty Token","KIT") {
        minter = msg.sender;
    }

    // When we first deploy out smart contract, we are the minter of the token. The purpose of this function is to make the game the minter by passing the game address.
    function passMinterRole(address game) public returns (bool) {
        require(msg.sender == minter, 'Error, only owner is allowed to change the mintor role');
        minter = game;

        emit MinterChanged(msg.sender,game);
        return true;
    }

    // Mint the token for the address
    function mint(address account, uint256 amount) public {
		require(msg.sender==minter, 'Error, msg.sender does not have minter role');
		_mint(account, amount);
	}
}