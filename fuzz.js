const deploy = require('./deploy-solc-0.4')
var glob = require("glob")
var fs = require('fs')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");

const numberOfContractsSeries = 1
let seriesInfo = JSON.parse(fs.readFileSync("params/seriesInfo.json"))
let runFuzzer = JSON.parse(fs.readFileSync("params/runFuzzer.json"))



Array(numberOfContractsSeries).fill().map((_, i) => {
    let serieIndex = i + 1
    let serieStringIndex = serieIndex.toString()

    runFuzzer[serieStringIndex].forEach((fuzzString) => {
        fuzzArray = fuzzString.split(",")
        var safety = fuzzArray[fuzzArray.length-1]
        let fileNameOne = fuzzArray[0]
        let fileNameTwo = fuzzArray[1]
        
        let contractOneSerieInfo = seriesInfo[serieStringIndex][fileNameOne]
        let contractTwoSerieInfo = seriesInfo[serieStringIndex][fileNameTwo]


        let returnAccounts = async () => {
            return await web3.eth.getAccounts((error,accounts) => {
            })    
        }

        let deploy = async (contractFileName, contractName, contractArguments) => {
            // later add the contractArguments part.

            //TODO: add the support for passing arguments when creating the contract.

            
            
            return await returnAccounts().then((accounts) => {

                output = compiler(contractFileName)

                //console.log(output.contracts)
                
                var jsonInterface = JSON.parse(output.contracts[":"+contractName].interface)
                
                var data = output.contracts[":"+contractName].bytecode
                
                
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


                return contract.deploy({data: data}).send({
                    from: accounts[0],
                    gas: 1500000,
                    gasPrice: '3000000000'
                }, function(error, transactionHash){
                }).then(deployedContract => {
                    return deployedContract.options.address
                })
                
                
                
                
            })
            
        }
        
    })
})