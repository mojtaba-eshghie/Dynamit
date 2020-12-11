const Web3 = require('web3')
const compiler = require('./compile-sol-file')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
//let web3 = new Web3("http://127.0.0.1:8545")
//let web3 = new Web3("http://127.0.0.1:7545")

const Web3 = require('web3')
const compiler = require('./compile-sol-file')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
//let web3 = new Web3("http://127.0.0.1:8545")
//let web3 = new Web3("http://127.0.0.1:7545")



let deploy = async (contractFileName) => {
    let contractAddress;

    await web3.eth.getAccounts(async (error,accounts) => {
        if (error) {
            console.log(error);
        } else { 
            //console.log("Account balance:")
            //console.log(web3.eth.getBalance(accounts[0]))
            
            output = compiler(contractFileName)
            var jsonInterface = output.contracts[contractFileName].Greeting.abi
            var data = output.contracts[contractFileName].Greeting.evm.bytecode
            
            var contract = new web3.eth.Contract(jsonInterface, {gasPrice: '12345678', from: accounts[0]})
            
            //console.log(accounts[0])
            
            
            var res = await contract.deploy({data: data.object})
                .send({
                        from: accounts[0],
                        gas: 1500000,
                        gasPrice: '3000000000'
                    }, function(error, transactionHash){

                    })
                    .on('error', function(error){ 
                        if (error) {
                            console.log('bad things ...')
                            console.log(error)
                        }
                    })
                    .on('transactionHash', function(transactionHash){ 

                    })
                    .on('receipt', function(receipt){
                        console.log('contract address:')
                        console.log(receipt.contractAddress) // contains the new contract address
                        contractAddress = receipt.contractAddress
                        console.log('account #0 address:')
                        console.log(accounts[0])
                        //return contractAddress
                    })
                    .then(function(newContractInstance){
                    
                    })          
        }
    })

    return contractAddress

}

module.exports = deploy;






let deploy = async (contractFileName) => {
    let contractAddress;

    await web3.eth.getAccounts(async (error,accounts) => {
        if (error) {
            console.log(error);
        } else { 
            //console.log("Account balance:")
            //console.log(web3.eth.getBalance(accounts[0]))
            
            output = compiler(contractFileName)
            var jsonInterface = output.contracts[contractFileName].Greeting.abi
            var data = output.contracts[contractFileName].Greeting.evm.bytecode
            
            var contract = new web3.eth.Contract(jsonInterface, {gasPrice: '12345678', from: accounts[0]})
            
            //console.log(accounts[0])
            
            
            var res = await contract.deploy({data: data.object})
                .send({
                        from: accounts[0],
                        gas: 1500000,
                        gasPrice: '3000000000'
                    }, function(error, transactionHash){

                    })
                    .on('error', function(error){ 
                        if (error) {
                            console.log('bad things ...')
                            console.log(error)
                        }
                    })
                    .on('transactionHash', function(transactionHash){ 

                    })
                    .on('receipt', function(receipt){
                        console.log('contract address:')
                        console.log(receipt.contractAddress) // contains the new contract address
                        contractAddress = receipt.contractAddress
                        console.log('account #0 address:')
                        console.log(accounts[0])
                        //return contractAddress
                    })
                    .then(function(newContractInstance){
                    
                    })          
        }
    })

    return contractAddress

}

module.exports = deploy;




