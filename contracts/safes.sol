pragma solidity ^0.4.0;

// fuzzing for external calls, 10 ether is what I need

contract Safe {
    
    GiveMeEverything public gme;
    string public checkpoint;
    uint public a = 0;
    uint public a_binary = 0;
    uint public counter = 0;
    uint public amount = 0;
    
    
    constructor() public payable {
        a = random(8);
        a_binary = random_binary(); // should we send money or not?
        amount = random(10) * 500000000000000000;
    }
    
    
    function random_binary() private view returns (uint8) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%2);
    }
    
    function random(uint num) private view returns (uint8) {
        return uint8(uint256(keccak256(block.timestamp, block.difficulty))%num);
    }
    
    
    function f1(address to_) public {
        checkpoint = "f1";
        gme = GiveMeEverything(to_);
        
        
        if (counter <= a) {
            counter++;
            gme.f1();
        } else {
            if (a_binary == 1) {
                require(gme.call.value(amount)());
            }
        }
    }
    
    function f2() public {
        checkpoint = "f2";
        
        if (counter <= a) {
            counter++;
            gme.f2();
        } else {
            if (a_binary == 1) {
                require(gme.call.value(amount)());
            }
        }
    }
    
    function f3() public {
        checkpoint = "f3";
        
        
        if (counter <= a) {
            counter++;
            gme.f3();
        } else {
            if (a_binary == 1) {
                require(gme.call.value(amount)());
            }
        }
    }
    
    function f4() public {
        checkpoint = "f4";
        
        if (counter <= a) {
            counter++;
            gme.f4();
        } else {
            if (a_binary == 1) {
                require(gme.call.value(amount)());
            }
        }
    }
    
    function f5() public {
        checkpoint = "f5";
        
        if (counter <= a) {
            counter++;
            gme.f5();
        } else {
            if (a_binary == 1) {
                require(gme.call.value(amount)());
            }
        }
        
    }
    
    function f6() public {
        checkpoint = "f6";
        
        if (counter <= a) {
            counter++;
            gme.f6();
        } else {
            if (a_binary == 1) {
                require(gme.call.value(amount)());
            }
        }
    }
    
    function f7() public {
        checkpoint = "f7";
        
        if (a_binary == 1) {
            require(gme.call.value(amount)());
        }
    
    }
}



contract GiveMeEverything {
    Safe public sf;
    string public checkpoint;
    
    constructor() payable {
        
    }
    
    function startAttack(address addr_) public {
        checkpoint = "startAttack";
        sf = Safe(addr_);
        sf.f1(address(this));
    }
    
    
    function f1() public {
        checkpoint = "f1";
        sf.f2();
    }
    
    function f2() public {
        checkpoint = "f2";
        sf.f3();
    }
    
    function f3() public {
        checkpoint = "f3";
        sf.f4();
    }
    
    function f4() public {
        checkpoint = "f4";
        sf.f5();
    }
    
    function f5() public {
        checkpoint = "f5";
        sf.f6();
    }
    
    function f6() public {
        checkpoint = "f7";
        sf.f7();
    }
    
    function() public payable {
        checkpoint = "fallback";
    }
    
    
    
}