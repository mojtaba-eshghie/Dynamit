pragma solidity ^0.4.26;

// The manager 'tells' the contract to randomly elect a winner

contract Lottery {
    //this mangager should be able to tell the contract to pick a winner, and 
    // whoever that creates the contract first time, is the manager. 
    address public manager;
    mapping(address => uint) public players;
    uint public total_balance; 
    uint public players_count; 
    address[] public players_helper_array; 
    
    //just for debugging in Remix
    uint public elected_winner;
    address public elected_winner_address;
    
    function Lottery() public payable {
        manager = msg.sender;
    }
    
    // in order to enter the lottary, the player has to send some amount of ether.
    // whenever we create a function that expects to receive ether, we have to mark the function as payable
    function enter() public payable {
        //let's overlook the fact that we're letting the manager to join the lottary himself!
        
        require(msg.value > .01 ether);  
        total_balance += msg.value;
        players[msg.sender] = msg.value;
        players_count += 1;
        players_helper_array.push(msg.sender);
    }
    
    
    function exit_voluentarily_the_lottery() public payable{
        // Here bad things DAO would happen 
        if (players[msg.sender] > 0) {
            msg.sender.call.value(0.95 ether)();
            total_balance = total_balance - 0.95 ether;
        }
    }
    
    
    function get_player_share() public view returns (uint) {
        return players[msg.sender];
    }
    
    function all_players() public view returns (address[]) {
        return players_helper_array;
    }
    
    // this function generates a big psuedo-random integer
    function random() private view returns (uint){
        return uint(sha3(block.difficulty, now));
    }
    
    // reset operations
    function reset() private {
        // not implemented yet
    }
    
    function randomly_elect_winner() public payable restricted{
        
        //only managers can initiate election;
        
        // select the winner
        uint index = random() % players_count;
        address address_of_winner = players_helper_array[index];
    
        // give all of the money to the winner 
        elected_winner = index;
        elected_winner_address = address_of_winner;
        elected_winner_address.transfer(total_balance);
        total_balance = 0;
        
        // reset();
    }
    
    modifier restricted() {
        require(msg.sender == manager);
        _;
    }
    
    modifier nonzero() {
        require(players[msg.sender] > 0 ether);
        _;
    }

}

