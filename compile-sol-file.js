const fs = require('fs')
const solc = require('solc')

var compiler = (fileName) => {

    file_content = fs.readFileSync("contracts/" + fileName, {encoding: 'utf-8'})
    

    var input = {
        language: 'Solidity',
        sources: {
          [fileName]: {
            content: file_content
          }
        },
        settings: {
          outputSelection: {
            '*': {
              '*': ['*']
            }
          }
        }
      };
      
      
      //var output = JSON.parse(solc.compile(JSON.stringify(input)));
      var output = solc.compile(file_content)
    
    return output
}

module.exports = compiler;