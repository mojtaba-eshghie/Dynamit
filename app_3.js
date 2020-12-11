const Web3 = require('web3')
const compiler = require('./compile-sol-file')


let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
//let web3 = new Web3("http://127.0.0.1:8545")
//let web3 = new Web3("http://127.0.0.1:7545")





let contractAddress;

web3.eth.getAccounts((error,accounts) => {
    if (error) {
        console.log(error);
    } else { 
        //console.log("Account balance:")
        //console.log(web3.eth.getBalance(accounts[0]))
        
        output = compiler('Hello.sol')
        var jsonInterface = output.contracts['Hello.sol'].Greeting.abi
        var data = output.contracts['Hello.sol'].Greeting.evm.bytecode
        
        var contract = new web3.eth.Contract(jsonInterface, {gasPrice: '12345678', from: accounts[0]})
        



        //console.log(accounts[0])
        
        
        var res = contract.deploy({data: data.object})
            .send({
                    from: accounts[0],
                    gas: 1500000,
                    gasPrice: '3000000000'
                }, function(error, transactionHash){
                    
                })
                .on('error', function(error){ 
                    console.log('bad things 2')
                })
                .on('transactionHash', function(transactionHash){ 
                    console.log(transactionHash)
                })
                .on('receipt', function(receipt){
                    console.log('contract address:')
                    console.log(receipt.contractAddress) // contains the new contract address
                    contractAddress = receipt.contractAddress
                    console.log('account #0 address:')
                    console.log(accounts[0])

                    



                    




                    
                    
                    
                    

                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    
                })
                .then(function(newContractInstance){
                    
                    console.log(newContractInstance.options.address) // instance with the new contract address

                    
                    // deployed? let's do something:
                    console.log('-------------------------------------')
                    newContractInstance.methods.sayHello().call({from: accounts[0]}, function(error, result){
                        console.log(result)
                        console.log(error)
                    });



                    
                    var subscription = web3.eth.subscribe('logs', {
                        address: contractAddress
                    }, function(error, result){
                        
                    })
                    .on("connected", function(res){

                        console.log("=>>>>>>>>>>>>>>>>>>>>>>>>> connected:")
                        console.log(res);
                        
                    })
                    .on("data", function(res){
                        console.log("=>>>>>>>>>>>>>>>>>>>>>>>>> data: ")
                        console.log(res);
                        
                    })
                    .on("changed", function(res){
                        console.log("=>>>>>>>>>>>>>>>>>>>>>>>>> changed:")
                        console.log(res)
                        console.log('-------------------------------------------\n-------------------------------------------\n-------------------------------------------\n')
                    })
                    



                    
                    
                    web3.eth.sendTransaction({
                        from: accounts[0],
                        to: contractAddress,
                        value: '1000'
                    })
                    .then(function(receipt){
                        console.log('just sent some ether to our contract.')
                    });


                    web3.eth.sendTransaction({
                        from: accounts[0],
                        to: contractAddress,
                        value: '1000'
                    })
                    .then(function(receipt){
                        console.log('just sent some ether to our contract.')
                    });

                    web3.eth.sendTransaction({
                        from: accounts[0],
                        to: contractAddress,
                        value: '1000'
                    })
                    .then(function(receipt){
                        console.log('just sent some ether to our contract.')
                    });

                    web3.eth.sendTransaction({
                        from: accounts[0],
                        to: contractAddress,
                        value: '1000'
                    })
                    .then(function(receipt){
                        console.log('just sent some ether to our contract.')
                    });

                    web3.eth.sendTransaction({
                        from: accounts[0],
                        to: contractAddress,
                        value: '1000'
                    })
                    .then(function(receipt){
                        console.log('just sent some ether to our contract.')
                    });
                    
                })
                



                
                
            
    }
})



