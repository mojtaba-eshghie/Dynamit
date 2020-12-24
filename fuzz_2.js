const deploy = require('./deploy-solc-0.4')
const Web3 = require('web3')
const glob = require("glob")
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let { exec } = require("child_process");

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");

const numOfTXs = 2

let seriesInfo = JSON.parse(fs.readFileSync("params/seriesInfo.json"))
let runFuzzer = JSON.parse(fs.readFileSync("params/runFuzzer.json"))

let tx_fuzz = JSON.parse(fs.readFileSync("params/tx_fuzz.json"))

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


let prev_victim_addr = null
let prev_attacker_addr = null
let prev_tx_hash = null
let current_tx_hash = null
let after_of_prev_tx_obj = null
let before_of_curr_tx_obj = null
let txBalanceInfo = Object()



    
Object.entries(tx_fuzz).forEach(([key, tx_params]) => {

    /*
    fuzzArray = fuzzString.split(",")
    var safety = fuzzArray[fuzzArray.length-1]
    let fileNameOne = fuzzArray[0]
    let fileNameTwo = fuzzArray[1]
    
    let contractOneSerieInfo = seriesInfo[serieStringIndex][fileNameOne]
    let contractTwoSerieInfo = seriesInfo[serieStringIndex][fileNameTwo]
    */
    

    //TODO: change the following to something universal
    //let contractOneAddress = contractOneSerieInfo["contracts"]["main"]["address"]
    //let contractTwoAddress = contractTwoSerieInfo["contracts"]["main"]["address"]
    
    
    let serieStringIndex = key
    console.log(serieStringIndex)
    let contractOneAddress = tx_fuzz[serieStringIndex]["victim"]["address"]
    let contractTwoAddress = tx_fuzz[serieStringIndex]["attacker"]["address"]

    let abi = tx_fuzz[serieStringIndex]["attacker"]["abi"]

    let fuzzString = tx_fuzz[serieStringIndex]["files"] + "," + tx_fuzz[serieStringIndex]["label"] + "," + serieStringIndex
    
    
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
                //console.log(tx)

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
                    //console.log(tx)
                    console.log("tx.from: " + tx.from + "\ntx.to: " + tx.to + "\nwe want from: " + contractTwoAddress + "\nto: " + contractOneAddress)
                }
            })
            



        })
        

        let newAttakcerInstance = new web3.eth.Contract(abi, contractTwoAddress, {
            gasPrice: randGasPrice, from: accounts[randAcountIndex]
        })
        
        setTimeout(() => {

            // first let's get the balance of previous pair of contracts before we issue any other tx
            console.log("Entering for :::: " + fuzzString)
            if (prev_tx_hash != null) {

                web3.eth.getBalance(prev_victim_addr)
                    .then(async (victim_bal) => {
                        return {
                            attacker_bal: await web3.eth.getBalance(prev_attacker_addr),
                            victim_bal: victim_bal
                        }
                    })
                    .then((bal_obj) => {
                        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n")
                    
                        console.log(bal_obj)
                        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n")
                        after_of_prev_tx_obj = bal_obj
                    })
                    .then(async () => {
                        return await web3.eth.getBalance(contractTwoAddress)
                    })
                    .then(async (attacker_bal) => {
                        return {
                            attacker_bal: attacker_bal,
                            victim_bal: await web3.eth.getBalance(contractOneAddress)
                        }
                    })
                    .then((bal_obj) => {
                        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n")
                        console.log(bal_obj)
                        console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n")
                        before_of_curr_tx_obj = bal_obj
                        
                        if (txBalanceInfo[current_tx_hash]) {
                            txBalanceInfo[current_tx_hash]['before_tx'] = before_of_curr_tx_obj
                        } else {
                            txBalanceInfo[current_tx_hash] = Object()
                            txBalanceInfo[current_tx_hash]['before_tx'] = before_of_curr_tx_obj
                        }
                        if (txBalanceInfo[prev_tx_hash]) {
                            txBalanceInfo[prev_tx_hash]['after_tx'] = after_of_prev_tx_obj
                        } else {
                            txBalanceInfo[prev_tx_hash] = Object()
                            txBalanceInfo[prev_tx_hash]['after_tx'] = after_of_prev_tx_obj
                        }
                    })
                    .then(() => {
                        // now let's execute this transaction
                        console.log("\n*********************************************\n*********************************************\n*********************************************\n")
                        console.log("doing: " + fuzzString)
                        newAttakcerInstance.methods.startAttack(contractOneAddress).send({from:accounts[randAcountIndex]})

                        // let's use prev_tx_hash here to get the debug_traceTransaction:
                        cmd = `curl localhost:8545 -X POST --header 'Content-type: application/json' --data '{"jsonrpc":"2.0", "method":"debug_traceTransaction", "params":["${prev_tx_hash}", {}], "id":1}' > data/trace_${serieStringIndex}.json`
                        exec(cmd, (error, stdout, stderr) => {
                            if (error) {
                                console.log(`error: ${error.message}`);
                                return;
                            }
                            if (stderr) {
                                console.log(`stderr: ${stderr}`);
                                return;
                            }
                            console.log(`stdout: ${stdout}`);
                        });


                        // let's set these for the next iteration
                        prev_attacker_addr = contractTwoAddress
                        prev_victim_addr = contractOneAddress
                        prev_tx_hash = current_tx_hash
                        
                    })
            } else {
                console.log("this is the first transaction?!")
                // now let's execute this transaction
                console.log("\n*******************-----*********************\n*********************************************\n*********************************************\n")
                console.log("doing: " + fuzzString)
                newAttakcerInstance.methods.startAttack(contractOneAddress).send({from:accounts[randAcountIndex]})
                

                

                prev_attacker_addr = contractTwoAddress
                prev_victim_addr = contractOneAddress
                prev_tx_hash = current_tx_hash
            }
            
        }, txTimeCounter)
        txTimeCounter = txTimeCounter + 120000






        console.log(contractOneAddress)
        console.log(contractTwoAddress)
        console.log("--------------\n\n")


        

        
        
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
                        console.log(txBalanceInfo)


                        // Let's do the following (as the after_tx is not recorded for the last tx)
                        web3.eth.getBalance(prev_victim_addr)
                        .then(async (victim_bal) => {
                            return {
                                attacker_bal: await web3.eth.getBalance(prev_attacker_addr),
                                victim_bal: victim_bal
                            }
                        })
                        .then((bal_obj) => {
                            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n")
                        
                            console.log(bal_obj)

                            console.log("and current tx hash is:")
                            console.log(current_tx_hash)
                            
                            console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n")
                            after_of_prev_tx_obj = bal_obj
                            if (txBalanceInfo[current_tx_hash]) {
                                txBalanceInfo[current_tx_hash]['after_tx'] = after_of_prev_tx_obj
                            } else {
                                txBalanceInfo[current_tx_hash] = Object()
                                txBalanceInfo[current_tx_hash]['after_tx'] = after_of_prev_tx_obj
                            }
                            
                        })
                        .then(() => {
                            // Let's write out the file:
                            const writableTXData = JSON.stringify(txBalanceInfo)
                            fs.writeFileSync('data/txBalanceInfo.json', writableTXData, (err) => {
                                if (err) {
                                    console.log("Something bad happened:")
                                    console.log(err)
                                } else {
                                    console.log("JSON data saved successfully to txBalanceInfo.json file.")
                                }
                            })
                        })

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
                            console.log(txBalanceInfo)


                                
                                // Let's do the following (as the after_tx is not recorded for the last tx)
                            web3.eth.getBalance(prev_victim_addr)
                            .then(async (victim_bal) => {
                                return {
                                    attacker_bal: await web3.eth.getBalance(prev_attacker_addr),
                                    victim_bal: victim_bal
                                }
                            })
                            .then((bal_obj) => {
                                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n")
                            
                                console.log(bal_obj)
                                console.log("and current tx hash is:")
                                console.log(current_tx_hash)
                                console.log("%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%\n")
                                after_of_prev_tx_obj = bal_obj
                                
                                if (txBalanceInfo[current_tx_hash]) {
                                    txBalanceInfo[current_tx_hash]['after_tx'] = after_of_prev_tx_obj
                                } else {
                                    txBalanceInfo[current_tx_hash] = Object()
                                    txBalanceInfo[current_tx_hash]['after_tx'] = after_of_prev_tx_obj
                                }
                            })
                            .then(() => {
                                // Let's write out the file:
                                const writableTXData = JSON.stringify(txBalanceInfo)
                                fs.writeFileSync('data/txBalanceInfo.json', writableTXData, (err) => {
                                    if (err) {
                                        console.log("Something bad happened:")
                                        console.log(err)
                                    } else {
                                        console.log("JSON data saved successfully to txBalanceInfo.json file.")
                                    }
                                })
                            })

                            console.log("\n====================================================\n====================================================\n====================================================\n")
                        });
            }, 25000*pendingTXs.length)
        }
    })

    


    
}, 500000)

