const Web3 = require('web3')
const compiler = require('./compile-sol-file')



//let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
//let web3 = new Web3("http://127.0.0.1:8545")

let web3 = new Web3("http://127.0.0.1:7545")

web3.eth.getAccounts((error,accounts) => {
    if (error) {
        console.log(error);
    } else {    
        output = compiler('Greeting.sol')
        var jsonInterface = output.contracts['Greeting.sol'].Greeting.abi
        var data = output.contracts['Greeting.sol'].Greeting.evm.bytecode
        
        console.log(data)
        
        var contract = new web3.eth.Contract(jsonInterface, {gasPrice: '12345678', from: accounts[0]})
        

        
        //var res = contract.deploy({data: data})
        
        //console.log(res)

        /*
        var res = contract.deploy({data: data}, (err,res) => {
            if(err){
                console.log(err);
            }
            if(res){
                console.log(res);
            }
        })
        */
        /*
        res.sendres.send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '30000000000000'
        }({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '30000000000000'
        }, function(error, transactionHash){
            console.log('something bad happened')
            console.log(transactionHash)
        })
        */
        
        contract.deploy({data: data.object})
            .send({
                    from: accounts[0],
                    gas: 1500000,
                    gasPrice: '30000000000000'
                }, function(error, transactionHash){
                    console.log('un-obvious???')
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
                })
                .on('confirmation', function(confirmationNumber, receipt){ 
                    console.log('confirmation... :')
                    console.log(confirmationNumber)
                })
                .then(function(newContractInstance){
                    
                    console.log(newContractInstance.options.address) // instance with the new contract address

                    
                    // deployed? let's do something:
                    console.log('-------------------------------------')
                    newContractInstance.methods.getGreeting().call({from: accounts[0]}, function(error, result){
                        console.log(result)
                        console.log(error)
                    });
                    
                    // or sending and using a promise
                    newContractInstance.methods.setGreeting("helllllllo world").send({from: accounts[0]})
                        .then(function(receipt){
                            console.log(receipt)
                            // receipt can also be a new contract instance, when coming from a "contract.deploy({...}).send()"
                        });
                    

                    newContractInstance.methods.getGreeting().call({from: accounts[0]}, function(error, result){
                        console.log(result)
                        console.log(error)
                    });
                })



                
                
            
    }
})



