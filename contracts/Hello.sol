//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.7.5;
// I installed the 0.7.5 solc using npm so I should use the same here!

contract Greeting {
  string message;

  function sayHello() public view returns (string memory) {
    return "hello";
  }  

  event Received(address, uint);
  
  receive() external payable {
    emit Received(msg.sender, msg.value);
  }
}
