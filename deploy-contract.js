const Web3 = require('web3')
const compiler = require('./compiler')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
//let web3 = new Web3("http://127.0.0.1:8545")
//let web3 = new Web3("http://127.0.0.1:7545")

let returnAccounts = async () => {
    return await web3.eth.getAccounts((error,accounts) => {
    })    
}

let deploy = async (contractFileName, contractName, contractArguments) => {
    // later add the contractArguments part.

    //TODO: add the support for passing arguments when creating the contract.

    
    
    return await returnAccounts().then((accounts) => {

        output = compiler(contractFileName)

        
        
        var jsonInterface = JSON.parse(output.contracts[":"+contractName].interface)
        
        var data = output.contracts[":"+contractName].bytecode
        
        console.log(jsonInterface)
        console.log('+++++++++++++++++++++++++++++++++++++++++++++++++++++++++')
        
        var contract = new web3.eth.Contract(jsonInterface, {gasPrice: '12345678', from: accounts[0], value: 30000000000000000000})
        
        return {
            data: data,
            contract: contract,
            accounts: accounts
        }
    }).then(res => {
        
        data = res.data
        contract = res.contract
        accounts = res.accounts

        /*
        return contract.deploy({data: data}).send({
            from: accounts[0],
            gas: 1500000,
            gasPrice: '3000000000'
        }, function(error, transactionHash){
        }).then(deployedContract => {
            return deployedContract.options.address
        })
        */
        
        
        
        
    })
    
}

module.exports = deploy;