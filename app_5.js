const Web3 = require('web3')
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let parse = require('csv-parse');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
let debug = require('web3-eth-debug')

web3.currentProvider.send({
    method: "debug_traceTransaction",
    params: ['0x8971ab4f866d58c484f27f0011c0b14f74e0cd9444c667821b774900a4afc70b', {}],
    jsonrpc: "2.0",
    id: "2"
}, function (err, result) {
    console.log(err)
    console.log(result)
});


//debug.getTransactionTrace('0x0', {}).then(console.log)

console.log(debug)