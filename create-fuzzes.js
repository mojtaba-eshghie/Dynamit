const deploy = require('./deploy-contract')
const Web3 = require('web3')
const glob = require("glob")
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");

let numberOfTXsForEachContractSet = 1 // put 10 here
let safety = null;
let file_name = null;
let source_code = null;


let files_to_use = [
    {
        file_name: 'vulnerables.sol', 
        mode: 'vul',
        value_for_sending_to_victim: 30000000000000000000
    },
    {
        file_name: 'safes.sol',
        mode: 'safe',
        value_for_sending_to_victim: 10000000000000000000
    }
]

let makeCreateTXFuzz = () => {
    files_to_use.forEach((file_object, index) => {
        safety = file_object['mode'];
        file_name = file_object['file_name']
    
        //source_code = fs.readFileSync('contracts/'+file_name);
    
        if (safety == "vul") {
    
            deploy(file_name, 'Vulnerable', file_object['value_for_sending_to_victim']).then(addr => {
                console.log(addr);
            })
            deploy(file_name, 'GiveMeEverything').then(addr => {
                console.log(addr);
            })
    
        } else if (safety == "safe") {
    
            deploy(file_name, 'Safe', file_object['value_for_sending_to_victim']).then(addr => {
                console.log(addr);
            })
    
            deploy(file_name, 'GiveMeEverything').then(addr => {
                console.log(addr);
            })
    
        }
    })
}



for (var i = 1; i <= numberOfTXsForEachContractSet; i++) {
    makeCreateTXFuzz()
}
