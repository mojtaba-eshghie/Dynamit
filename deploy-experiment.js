const deploy = require('./deploy-solc-0.4')
var glob = require("glob")
var fs = require('fs')
const readline = require("readline");

/**
 * Each contract serie consists of one i.sol and multiple i_attacker.sol, i_attacker_benign.sol
 */
const numberOfContractsSeries = 1
let series = JSON.parse(fs.readFileSync("series.json"))
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
seriesInformation = Object() // this would hold all the information about the series


var options = {
    'cwd': process.cwd() + '/contracts',
}

let isMain = (fileName) => {
    if (!fileName.includes("attack")) {
        return true
    } else {
        return false
    }
}

Array(numberOfContractsSeries).fill().map((_, i) => {
    j = i + 1 // j is the real index of the series in the contracts directory
    seriesStringIndex = j.toString()
    let thisMainContratName = null

    glob(j.toString()+ "*.sol", options, (er, files) => {
        
        if (files.length != 0) {
            files.sort()
            
            /*
            console.log(files[0])
            deploy(files[0], "Lottery").then(deployedContractAddr => {
                console.log(deployedContractAddr)    
            })
            */

            // Let's deploy each contract:
            
            files.forEach(fileName => {
                let ctName
                let ctArg

                if (isMain(fileName)) {
                    // It is the main file (i.sol)
                    series[j.toString()]["main"].forEach(contractNameAndArgs => {
                        for (var contractName of Object.keys(contractNameAndArgs)) {
                            ctName = contractName
                            ctArg = contractNameAndArgs[contractName]
                            if (contractNameAndArgs["isMainContract"]) {
                                thisMainContratName = contractName
                            }
                        }
                    })
                } else {
                    // It is either the attackers or attacker benigns
                    series[j.toString()]["attackers"].forEach(contractNameAndArgs => {
                        for (var contractName of Object.keys(contractNameAndArgs)) {
                            ctName = contractName
                            ctArg = contractNameAndArgs[contractName]
                        }
                    })
                }




                // supplying with arguments:
                if (ctArg == "") {
                    // The contract does not require arguments
                    
                    deploy(fileName, ctName).then(deployedContractAddr => {
                        
                        
                        // now, let's add the information to seriesInformation object
                        if (!seriesInformation[seriesStringIndex]){
                            seriesInformation[seriesStringIndex] = {
                                [fileName]: {
                                    [ctName]: {
                                        "address": deployedContractAddr
                                    }
                                }
                            }
                            
                        } else {
                            seriesInformation[seriesStringIndex][fileName][ctName]["address"] = deployedContractAddr;
                        }

                        console.log(seriesInformation)

                    })

                } else {
                    /*
                    setTimeout(() => {

                        console.log("We are at serie: " + seriesStringIndex + ", in file: " + fileName + ", contract: " + ctName)
                        console.log("Address of deployed main contract:  " + seriesInformation[seriesStringIndex][seriesStringIndex+".sol"][thisMainContratName]["address"])
                        rl.question("Please provide the following arguments that your contract needs: " + ctArg, (name) => {
                            console.log(name)
                        });
                        // The contract does not require arguments
                        // TODO
                    }, 25000)
                    */
                }
                
                
            })
            
            

        }
    })
      
});

