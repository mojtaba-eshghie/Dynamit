curl localhost:8545 -X POST --header 'Content-type: application/json' --data '{"jsonrpc":"2.0", "method":"debug_traceTransaction", "params":["0x6560a204480dd3fef55ead35e8623093de8d32c46560a2dbafbd949e4cf0a541", {}], "id":1}' > trace.json

web3.personal.unlockAccount(web3.eth.accounts[0], "123", 1000000000)
web3.personal.unlockAccount(web3.eth.accounts[1], "123", 1000000000)
web3.personal.unlockAccount(web3.eth.accounts[2], "123", 1000000000)
web3.personal.unlockAccount(web3.eth.accounts[3], "123", 1000000000)
web3.personal.unlockAccount(web3.eth.accounts[4], "123", 1000000000)
web3.personal.unlockAccount(web3.eth.accounts[5], "123", 1000000000)