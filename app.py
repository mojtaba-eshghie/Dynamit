#!/usr/bin/python3

from web3 import Web3
web3 = Web3(Web3.WebsocketProvider("ws://localhost:33333"))

if not web3.isConnected():
    raise Exception("Could not connect to web3")

print(web3.eth.accounts)
