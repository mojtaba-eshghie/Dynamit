const Web3 = require('web3')
const fs = require('fs')


let web3 = new Web3(Web3.givenProvider || "ws://localhost:33333");
let tx_fuzz = JSON.parse(fs.readFileSync("params/tx_fuzz.json"))

let sc_balance_object = {
    
}

process.argv.forEach((val, index, array) => {
    if (index == 2) {
        
    
        Object.entries(tx_fuzz).forEach(([key, tx_params]) => {
            
            
            web3.eth.getBalance(tx_params["attacker"]["address"]).then((balance) => {
                sc_balance_object[tx_params["attacker"]["address"]] = balance
            })

            
            web3.eth.getBalance(tx_params["victim"]["address"]).then((balance) => {
                sc_balance_object[tx_params["victim"]["address"]] = balance
            })

        })
        
        
        // when storing the results:
        if (val == "before") {
            setTimeout(() => {
                console.log(sc_balance_object)
                fs.writeFileSync("data/sc-balances-before-exec.json", JSON.stringify(sc_balance_object))
                console.log("Just wrote the balance information to sc-balances-before-exec.json file.")
            }, 3000)    
            
        } else if (val == "after") {
            setTimeout(() => {
                console.log(sc_balance_object)
                fs.writeFileSync("data/sc-balances-after-exec.json", JSON.stringify(sc_balance_object))
                console.log("Just wrote the balance information to sc-balances-after-exec.json file.")
            }, 3000) 
        }
    }    
});