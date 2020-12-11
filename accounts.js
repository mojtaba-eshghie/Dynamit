const Web3 = require('web3')
const solc = require('solc')

let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");

var prv_key, pub_key;
res = web3.eth.accounts.create("1234")
//console.log(res)


web3.eth.getAccounts((error,result) => {
    if (error) {
        console.log(error);
    } else {
        console.log(result)
    }
})


