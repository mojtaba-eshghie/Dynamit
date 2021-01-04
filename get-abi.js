const fs = require('fs')
const solc = require('solc')

var get_abi = (fileName) => {

    file_content = fs.readFileSync("contracts/" + fileName, {encoding: 'utf-8'})
    
      
    
    //var output = JSON.parse(solc.compile(JSON.stringify(input)));
    var output = solc.compile(file_content)

    return JSON.parse(output.contracts[":GiveMeEverything"].interface)
}

module.exports = get_abi;