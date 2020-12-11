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
      
      console.log(input)
      
      //var output = JSON.parse(solc.compile(JSON.stringify(input)));
      var output = solc.compile(file_content)
      console.log(output)
    
    return output
}

module.exports = compiler;