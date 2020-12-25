const deploy = require('./deploy-solc-0.4')
const Web3 = require('web3')
const glob = require("glob")
const fs = require('fs')
const createCsvWriter = require('csv-writer').createObjectCsvWriter;
let parse = require('csv-parse');
let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");




/*
web3.eth.getPendingTransactions().then((pendingTXs) => {
    if (pendingTXs.length == 0)
        console.log(0)
    else
        console.log(1)
})
*/

let getTXReceipt = async (tx_hash) => {
    return await web3.eth.getTransactionReceipt(tx_hash)
}


let jsonTXData;


let parser = parse({columns: true}, (err, records) => {
    
    for (const [index, tx_object] of Object.entries(records)) {
        
        //console.log(tx_object['tx_hash'])

        getTXReceipt(tx_object['tx_hash']).then((tx_receipt) => {
            
            tx_object['gas_used'] = tx_receipt['gasUsed'].toString()
            
            records[index] = tx_object
        })

        tx_object['victim_balance_before_tx'] = null
        tx_object['victim_balance_after_tx'] = null
        tx_object['attacker_balance_before_tx'] = null
        tx_object['attacker_balance_after_tx'] = null
        
    }

    setTimeout(() => {
                
        let txBalanceInfo = fs.readFileSync('data/txBalanceInfo.json')
        txBalanceInfo = JSON.parse(txBalanceInfo.toString())

        for (const [index, tx_object] of Object.entries(records)) {
            if (txBalanceInfo[records[index]['tx_hash']]) {
                if (txBalanceInfo[records[index]['tx_hash']]['before_tx']) {
                    records[index]['victim_balance_before_tx'] = txBalanceInfo[records[index]['tx_hash']]['before_tx']['victim_bal']
                    records[index]['attacker_balance_before_tx'] = txBalanceInfo[records[index]['tx_hash']]['before_tx']['attacker_bal']
                }
                if (txBalanceInfo[records[index]['tx_hash']]['after_tx']) {
                    records[index]['victim_balance_after_tx'] = txBalanceInfo[records[index]['tx_hash']]['after_tx']['victim_bal']
                    records[index]['attacker_balance_after_tx'] = txBalanceInfo[records[index]['tx_hash']]['after_tx']['attacker_bal']
                }
            }
        }

        

        // let's save it to a csv file.


        console.log(records)
        const csvWriter = createCsvWriter({
            path: 'data/final.csv',
            header: [
                {id: 'from', title: 'from'},
                {id: 'to', title: 'to'},
                {id: 'value', title: 'value'},
                {id: 'gas', title: 'gas'},
                {id: 'gas_used', title: 'gas_used'},
                {id: 'input', title: 'input'},
                {id: 'tx_hash', title: 'tx_hash'},
                {id: 'fuzz_string', title: 'fuzz_string'},
                {id: 'victim_balance_before_tx', title: 'victim_balance_before_tx'},
                {id: 'victim_balance_after_tx', title: 'victim_balance_after_tx'},
                {id: 'attacker_balance_before_tx', title: 'attacker_balance_before_tx'},
                {id: 'attacker_balance_after_tx', title: 'attacker_balance_after_tx'}
            ]
        });

        csvWriter.writeRecords(records).then(() => {
            console.log('***')
        })
        





    }, 3000)

    

});


fs.createReadStream('data/out.csv').pipe(parser);




