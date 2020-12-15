const deploy = require('./deploy-solc-0.4')
const Web3 = require('web3')
const glob = require("glob")
const fs = require('fs')
let returnABI = require('./returnABI') 
const createCsvWriter = require('csv-writer').createObjectCsvWriter;

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");



web3.eth.getPendingTransactions().then((pendingTXs) => {
    if (pendingTXs.length == 0)
        console.log(0)
    else
        console.log(1)
})

