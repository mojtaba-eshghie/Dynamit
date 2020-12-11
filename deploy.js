const Web3 = require('web3')
const compiler = require('./compile-sol-file')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
//let web3 = new Web3("http://127.0.0.1:8545")
//let web3 = new Web3("http://127.0.0.1:7545")

let returnAccounts = async () => {
    return await web3.eth.getAccounts((error,accounts) => {
    })    
}

let deploy = async (contractFileName) => {
    
    
    return await returnAccounts().then((accounts) => {

        output = compiler(contractFileName)
        var jsonInterface = output.contracts[contractFileName].Greeting.abi
        var data = output.contracts[contractFileName].Greeting.evm.bytecode
        
        var contract = new web3.eth.Contract(jsonInterface, {gasPrice: '12345678', from: accounts[0]})
        
        return {
            data: data,
            contract: contract,
            accounts: accounts
        }
    }).then(res => {
        
        data = res.data
        contract = res.contract
        accounts = res.accounts

        return contract.deploy({data: data.object}).send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '3000000000'
        }, function(error, transactionHash){
        }).then(deployedContract => {
            return deployedContract.options.address
        })
        
        
        
    })
}

module.exports = deploy;


