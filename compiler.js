const Web3 = require('web3')
const solc = require('solc')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");

//console.log(Web3.utils)
//console.log(Web3.givenProvider)
//console.log(Web3.providers)
//console.log(Web3.modules)
var prv_key, pub_key;
prv_key, pub_key = web3.eth.accounts.create("1234")
console.log(prv_key)
console.log(pub_key)

web3.eth.getAccounts(console.log)

