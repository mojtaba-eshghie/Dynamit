pragma solidity ^0.4.26;

contract EtherStore {
    uint256 public withdrawalLimit = 1 ether;
    mapping(address => uint256) public lastWithdrawTime;
    mapping(address => uint256) public balances;
    uint public counter;

    function EtherStore() public payable {
        
    }
    
    function depositFunds() public payable {
        balances[msg.sender] += msg.value;
    }
    function withdrawFunds (uint256 _weiToWithdraw) public {
        counter = counter + 1;
        //require(balances[msg.sender] >= _weiToWithdraw);
        //require(_weiToWithdraw <= withdrawalLimit);
        //require(now >= lastWithdrawTime[msg.sender] + 1 weeks);
        
        //require(msg.sender.call.value(_weiToWithdraw)());
        
        //msg.sender.call.value(_weiToWithdraw)();
        
        balances[msg.sender] -= _weiToWithdraw;
        lastWithdrawTime[msg.sender] = now;
    }
}