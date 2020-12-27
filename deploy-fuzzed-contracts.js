const deploy = require('./deploy-contract')
const Web3 = require('web3')
const glob = require("glob")
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");


let safety = null;
let file_name = null;
let source_code = null;


let files_to_use = [
    {
        file_name: 'vulnerables.sol', 
        mode: 'vul'
    },
    {
        file_name: 'safes.sol',
        mode: 'safe'
    }
]

files_to_use.forEach((file_object, index) => {
    safety = file_object['mode'];
    file_name = file_object['file_name']

    //source_code = fs.readFileSync('contracts/'+file_name);

    if (safety == "vul") {
        deploy(file_name, 'Vulnerable');
    } else if (safety == "safe") {
        deploy(file_name, 'Safe')
    }
    


})