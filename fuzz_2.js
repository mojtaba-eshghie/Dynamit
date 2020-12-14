const deploy = require('./deploy-solc-0.4')
const Web3 = require('web3')
const glob = require("glob")
const fs = require('fs')
let returnABI = require('./returnABI') 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");

const numberOfContractsSeries = 1
let seriesInfo = JSON.parse(fs.readFileSync("params/seriesInfo.json"))
let runFuzzer = JSON.parse(fs.readFileSync("params/runFuzzer.json"))
let subscriptionHolder = Object()


const csvWriter = createCsvWriter({
    path: 'data/out.csv',
    header: [
      {id: 'from', title: 'from'},
      {id: 'to', title: 'to'},
      {id: 'value', title: 'value'},
      {id: 'block_number', title: 'block_number'},
      {id: 'gas', title: 'gas'},
      {id: 'input', title: 'input'},
      {id: 'target_balance_before_tx', title: 'target_balance_before_tx'},
      {id: 'target_balance_after_tx', title: 'target_balance_after_tx'},
      {id: 'attacker_balance_before_tx', title: 'attacker_balance_before_tx'},
      {id: 'attacker_balance_after_tx', title: 'attacker_balance_after_tx'},
      {id: 'timestamp', title: 'timestamp'},
      {id: 'tx_index', title: 'tx_index'},
      {id: 'tx_hash', title: 'tx_hash'},
    ]
});
let data = []






/*
subscription.unsubscribe(function(error, success){
    console.log('unsubing')
});
*/


Array(numberOfContractsSeries).fill().map(async (_, i) => {
    let serieIndex = i + 1
    let serieStringIndex = serieIndex.toString()

    

    return await runFuzzer[serieStringIndex].forEach(async (fuzzString) => {
        

        fuzzArray = fuzzString.split(",")
        var safety = fuzzArray[fuzzArray.length-1]
        let fileNameOne = fuzzArray[0]
        let fileNameTwo = fuzzArray[1]
        
        let contractOneSerieInfo = seriesInfo[serieStringIndex][fileNameOne]
        let contractTwoSerieInfo = seriesInfo[serieStringIndex][fileNameTwo]
        //TODO: change the following to something universal
        let contractOneAddress = contractOneSerieInfo["contracts"]["main"]["address"]
        let contractTwoAddress = contractTwoSerieInfo["contracts"]["main"]["address"]
        
        let abi = contractTwoSerieInfo["contracts"]["main"]["abi"]
        
        
        web3.eth.getAccounts((error,accounts) => {
            if (error) {
                console.log(error)
                return 0
            }
            
            return accounts
        }).then((accounts) => {
        
        
        
        let randAcountIndex = Math.floor(Math.random() * 5)
        let randGasPrice = '12345' + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString() + Math.floor(Math.random() * 9).toString()
        console.log('rand act index:')
        console.log(randAcountIndex)
        console.log('rand gas price:')
        console.log(randGasPrice)


        let target_balance_before_tx;
        let target_balance_after_tx;
        let attacker_balance_before_tx;
        let attacker_balance_after_tx;


        subscriptionHolder[fuzzString] = web3.eth.subscribe('pendingTransactions', function(error, result){  
                
            })
            .on("connected", function(res){
                /*
                console.log("=>>>>>>>>>>>>>>>>>>>>>>>>> connected:")
                console.log(res);
                console.log("=====================================")
                */
            })
            .on("data", (res) => {
                console.log(">>>>> data: ")
                console.log(res);
                console.log("=====================================\n")
                
                web3.eth.getTransaction(res).then(tx => {
                    console.log(tx)

                    if (tx.from == accounts[randAcountIndex] && tx.to == contractTwoAddress && tx.gasPrice == randGasPrice) {
                        
                        web3.eth.getBalance(contractOneAddress).then(async (target_bal) => {
                    
                            target_balance_after_tx = target_bal
            
                            await web3.eth.getBalance(contractTwoAddress).then((attacker_bal) => {
            
                                attacker_balance_after_tx = attacker_bal
            
                            })
                            
                        }).then(() => {
                            
                            
                                
                            data.push({
                                "from": tx.from,
                                "to": tx.to,
                                "value": tx.value,
                                "block_number": tx.blockNumber,
                                "gas": tx.gas,
                                "input": tx.input,
                                'target_balance_before_tx': target_balance_before_tx,
                                'target_balance_after_tx': target_balance_after_tx,
                                'attacker_balance_before_tx': attacker_balance_before_tx,
                                'attacker_balance_after_tx': attacker_balance_after_tx,
                                "timestamp": Date.now(),
                                "tx_index": tx.transactionIndex,
                                "tx_hash": tx.hash
                            })

                            subscriptionHolder[fuzzString].unsubscribe((error) => {
                                console.log("Unsubscribing from " + fuzzString + ", Error is " + error)
                            })

                            csvWriter
                                .writeRecords(data)
                                    .then(() => {
                                        console.log("just wrote a piece of data to file")
                                    });
                            
                        })


                        

                    } else {
                        console.log("\ntx is not what we want...: ")
                        console.log(tx)
                        console.log("tx.from: " + tx.from + "\ntx.to: " + tx.to + "\nwe want from: " + contractTwoAddress + "\nto: " + contractOneAddress)
                    }
                })
                



            })
            
            web3.eth.getBalance(contractOneAddress).then(async (target_bal) => {
                
                target_balance_before_tx = target_bal

                await web3.eth.getBalance(contractTwoAddress).then((attacker_bal) => {

                    attacker_balance_before_tx = attacker_bal

                })
                
            }).then(() => {

                let newAttakcerInstance = new web3.eth.Contract(abi, contractTwoAddress, {
                    gasPrice: randGasPrice, from: accounts[randAcountIndex]
                })
                
                newAttakcerInstance.methods.startAttack(contractOneAddress).send({from:accounts[randAcountIndex]})

            })




            console.log(contractOneAddress)
            console.log(contractTwoAddress)
            console.log("--------------\n\n")


            

            
            
        })
        
        
        
    })

})


