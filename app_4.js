const deploy = require('./deploy-solc-0.4')


deploy('Hello.sol').then(res => {
    console.log(res)    
})
