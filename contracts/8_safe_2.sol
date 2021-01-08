pragma solidity ^0.4.19;

// this needs 11 ethers to run

contract FreeDonate {
    mapping(address => bool) public isDonated;
    uint256 public counter;
    
    constructor() public payable {
        
    }
    
    function donateMe() public {
        
        if (isDonated[msg.sender] != true) {
            counter++;
            isDonated[msg.sender] = true;
            A(msg.sender);
        }
        
    }
    
    function A(address to_) private {
        counter++;
        B(to_);
    }
    
    function B(address to_) private {
        counter++;
        C(to_);
    }
    
    function C(address to_) private {
        counter++;
        //to_.call.value(1 ether)();
        
    }
}