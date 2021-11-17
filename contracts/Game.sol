// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

import './Token.sol';

contract Game {
    string public name = "Blockchain Quiz Game";
    Token public token;

    constructor(Token _token) {
        token = _token;
    }

    mapping (address => uint256) public rewardEarned;

    event Issued(address _receiver, uint _amount);

    function issueRewards(address _receiver, uint256 _amount) public {
        // Require _amount to be greater than 0
        require(_amount >0,'Error: reward amount must be greater than 0');
        // Require previous rewards to be 0
        require(rewardEarned[_receiver] == 0, 'Error: You have already earned rewards');
        // Mint rewards to the _receiver
        token.mint(_receiver, _amount);
        // Emit event
        emit Issued(_receiver, _amount);
    }
}