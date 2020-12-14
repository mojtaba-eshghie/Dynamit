pragma solidity ^0.4.19;

contract PIGGY_BANK
{
    uint public counter;
    mapping (address => uint) public Accounts;
    uint public MinSum = 1 ether;
    Log LogFile;
    uint putBlock;
    function PIGGY_BANK(address _log) public payable
    {
        counter = 0;
        LogFile = Log(_log);
    }
    function Put(address to) public payable
    {
        Accounts[to]+=msg.value;
        LogFile.AddMessage(msg.sender,msg.value,"Put");
        putBlock = block.number;
    }
    function Collect(uint _am) public payable {
        counter = counter + 1;
        if(_am<=Accounts[msg.sender]) {
            if(msg.sender.call.value(_am)()) {
                Accounts[msg.sender]-=_am;
                LogFile.AddMessage(msg.sender,_am,"Collect");
            }
        }
    }
    
    
    function show_account(address addr) public view returns (uint) {
        return Accounts[addr];
    }
    
    function() public payable
    {
        Put(msg.sender);
    }
}


contract Log
{
    struct Message
    {
        address Sender;
        string  Data;
        uint Val;
        uint  Time;
    }
    Message[] public History;
    Message LastMsg;
    function AddMessage(address _adr,uint _val,string _data) public
    {
        LastMsg.Sender = _adr;
        LastMsg.Time = now;
        LastMsg.Val = _val;
        LastMsg.Data = _data;
        History.push(LastMsg);
    }
}