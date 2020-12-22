let fs = require('fs')

let data = fs.readFileSync('data/tempdata.json')

JSON.parse(data.toString())