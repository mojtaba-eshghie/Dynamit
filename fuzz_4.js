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
let txTimeCounter = 0


const csvWriter = createCsvWriter({
    path: 'data/out.csv',
    header: [
      {id: 'from', title: 'from'},
      {id: 'to', title: 'to'},
      {id: 'value', title: 'value'},
      {id: 'gas', title: 'gas'},
      {id: 'input', title: 'input'},
      {id: 'tx_hash', title: 'tx_hash'},
      {id: 'fuzz_string', title: 'fuzz_string'},
    ]
});
let data = []






/*
subscription.unsubscribe(function(error, success){
    console.log('unsubing')
});
*/


let prev_victim_addr = null
let prev_attacker_addr = null
let prev_tx_hash = null
let current_tx_hash = null


Array(numberOfContractsSeries).fill().map(async (_, i) => {
    let serieIndex = i + 1
    let serieStringIndex = serieIndex.toString()

    console.log(runFuzzer)

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
                        
                            
                                
                        data.push({
                            "from": tx.from,
                            "to": tx.to,
                            "value": tx.value,
                            "gas": tx.gas,
                            "input": tx.input,
                            "tx_hash": tx.hash,
                            "fuzz_string": fuzzString
                        })

                        subscriptionHolder[fuzzString].unsubscribe((error) => {
                            console.log("Unsubscribing from " + fuzzString + ", Error is " + error)
                        })


                        current_tx_hash = tx.hash

                    } else {
                        console.log("\ntx is not what we want...: ")
                        console.log(tx)
                        console.log("tx.from: " + tx.from + "\ntx.to: " + tx.to + "\nwe want from: " + contractTwoAddress + "\nto: " + contractOneAddress)
                    }
                })
                



            })
            

            let newAttakcerInstance = new web3.eth.Contract(abi, contractTwoAddress, {
                gasPrice: randGasPrice, from: accounts[randAcountIndex]
            })
            
            setTimeout(() => {

                // first let's get the balance of previous pair of contracts before we issue any other tx
                
                if (prev_attacker_addr != null) {

                    web3.eth.getBalance(prev_victim_addr)
                        .then(async (victim_bal) => {
                            return {
                                attacker_bal: await web3.eth.getBalance(prev_attacker_addr),
                                victim_bal: victim_bal
                            }
                        })
                        .then((bal_obj) => {
                            console.log(bal_obj)
                        })
                        .then(() => {
                            // now let's execute this transaction
                            console.log("\n*********************************************\n*********************************************\n*********************************************\n")
                            console.log("doing: " + fuzzString)
                            newAttakcerInstance.methods.startAttack(contractOneAddress).send({from:accounts[randAcountIndex]})
                            

                            // let's put these into somewhere


                            // let's set these for the next iteration
                            prev_attacker_addr = contractTwoAddress
                            prev_victim_addr = contractOneAddress
                            prev_tx_hash = current_tx_hash
                            
                        })
                } else {
                    // now let's execute this transaction
                    console.log("\n*********************************************\n*********************************************\n*********************************************\n")
                    console.log("doing: " + fuzzString)
                    newAttakcerInstance.methods.startAttack(contractOneAddress).send({from:accounts[randAcountIndex]})
                    
                    prev_attacker_addr = contractTwoAddress
                    prev_victim_addr = contractOneAddress
                    prev_tx_hash = current_tx_hash
                }
                
            }, txTimeCounter)
            txTimeCounter = txTimeCounter + 60000
            //Math.floor(Math.random() * 400000)






            console.log(contractOneAddress)
            console.log(contractTwoAddress)
            console.log("--------------\n\n")


            

            
            
        })
        
        
        
    })

})

let timeCounter = 0;
setInterval(() => {
    timeCounter++;
    console.log("Elapsed time: " + timeCounter.toString())
}, 1000)

setTimeout(() => {

        
    web3.eth.getPendingTransactions().then((pendingTXs) => {
        if (pendingTXs.length == 0){
            // no pending tx, assuming that everything is over
            csvWriter
                .writeRecords(data)
                    .then(() => {
                        console.log("\n====================================================\n====================================================\n====================================================\n")
                        console.log("just wrote collected data to file")
                        console.log("\n====================================================\n====================================================\n====================================================\n")
                    });
        } else {
            // We're in trouble, and there are more tx's. Let's wait a bit more
            setTimeout(() => {
                csvWriter
                    .writeRecords(data)
                        .then(() => {
                            console.log("\n====================================================\n====================================================\n====================================================\n")
                            console.log("just wrote collected data to file")
                            console.log("\n====================================================\n====================================================\n====================================================\n")
                        });
            }, 15000*pendingTXs.length)
        }
    })

    


    
}, 700000)

