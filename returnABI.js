const Web3 = require('web3')
const compiler = require('./compile-sol-file')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
//let web3 = new Web3("http://127.0.0.1:8545")
//let web3 = new Web3("http://127.0.0.1:7545")


let returnABI = (contractFileName, contractName, contractArguments) => {
    // later add the contractArguments part.

    //TODO: add the support for passing arguments when creating the contract.


    content_1_sol = fs.readFileSync("contracts/" + "1.sol", {encoding: 'utf-8'})

    var input = {
        language: 'Solidity',
        sources: {
          [fileName]: {
            content: file_content
          },
          "1.sol": {
            content: content_1_sol
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
    };


    output = compiler(contractFileName)
    console.log(output)
    
        
    var jsonInterface = JSON.parse(output.contracts[":"+contractName].interface)
        
    return jsonInterface
    
}


module.exports = returnABI