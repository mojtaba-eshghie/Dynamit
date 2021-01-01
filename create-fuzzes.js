const deploy = require('./deploy-contract')
const Web3 = require('web3')
const glob = require("glob")
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
const get_abi = require('./get-abi');

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");

let numberOfTXsForEachContractSet = 40// put 10 here
let safety = null;
let file_name = null;
let source_code = null;
let tx_array = []
let current_generated_txs = 25;
let lock = false;
let fuzzCreationTime = 0;


let files_to_use = [
    {
        file_name: 'vulnerables.sol', 
        mode: 'vul',
        value_for_sending_to_victim: 100000000000000000000
    },
    {
        file_name: 'safes.sol',
        mode: 'safe',
        value_for_sending_to_victim: 10000000000000000000
    }
]

/*
let files_to_use = [
    {
        file_name: 'vulnerables.sol', 
        mode: 'vul',
        value_for_sending_to_victim: 100000000000000000000
    },
]
*/

vulnerable_set_attacker_abi = get_abi('vulnerables.sol');
safe_set_attacker_abi = get_abi('safes.sol');


let makeCreateTXFuzz = () => {
    files_to_use.forEach((file_object, index) => {
        safety = file_object['mode'];
        file_name = file_object['file_name']
        
        

        if (safety == "vul") {
            
            deploy('vulnerables.sol', 'Vulnerable', file_object['value_for_sending_to_victim'])
                .then(async (victim_addr) => {
                    return {
                        victim_addr: victim_addr,
                        attacker_addr: await deploy('vulnerables.sol', 'GiveMeEverything')
                    };
                })
                .then(addr_object => {
                    let tx_object = {
                        "files": 'vulnerables.sol',
                        "attacker": {
                            "address": addr_object["attacker_addr"],
                            "abi": vulnerable_set_attacker_abi
                        },
                        "victim": {
                            "contract_name": "Vulnerable",
                            "address": addr_object["victim_addr"],
                        },
                        "label": "vul"
                    }
                    
                    let thisInterval = setInterval(() => {
                        if (lock == false) {
                            lock = true;
                            console.log("Locked the critical section.")
                            clearInterval(thisInterval);
                            current_generated_txs++;
                            the_json_txs_object = JSON.parse(fs.readFileSync('params/tx_fuzz.json'))
                            the_json_txs_object[current_generated_txs.toString()] = tx_object;
                            fs.writeFileSync('params/tx_fuzz.json', JSON.stringify(the_json_txs_object, null, 4))
                            console.log("Releasing the lock......")
                            lock = false;
                        } else {
                            console.log("critical section was locked, waiting...")
                            return;
                        }
                    }, 1000)
                    

                });
                    

            
                    
    
        } else if (safety == "safe") {

            deploy('safes.sol', 'Safe', file_object['value_for_sending_to_victim'])
                .then(async (victim_addr) => {
                    return {
                        victim_addr: victim_addr,
                        attacker_addr: await deploy('safes.sol', 'GiveMeEverything')
                    };
                })
                .then(addr_object => {
                    let tx_object = {
                        "files": 'safes.sol',
                        "attacker": {
                            "address": addr_object["attacker_addr"],
                            "abi": safe_set_attacker_abi
                        },
                        "victim": {
                            "contract_name": "Safe",
                            "address": addr_object["victim_addr"],
                        },
                        "label": "safe"
                    }

                    let thisInterval = setInterval(() => {
                        if (lock == false) {
                            lock = true;
                            console.log("Locked the critical section.")
                            clearInterval(thisInterval);
                            current_generated_txs++;
                            the_json_txs_object = JSON.parse(fs.readFileSync('params/tx_fuzz.json'))
                            the_json_txs_object[current_generated_txs.toString()] = tx_object;
                            fs.writeFileSync('params/tx_fuzz.json', JSON.stringify(the_json_txs_object, null, 4))
                            console.log("Releasing the lock......")
                            lock = false;
                        } else {
                            console.log("critical section was locked, waiting...")
                            return;
                        }
                    }, 1000)
                });
        }
    })
}



for (var i = 1; i <= numberOfTXsForEachContractSet; i++) {
    setTimeout(() => {
        console.log(`*********** Creating new transaction pair ************`)
        makeCreateTXFuzz()
    }, fuzzCreationTime)
    fuzzCreationTime = fuzzCreationTime + 15000
}


