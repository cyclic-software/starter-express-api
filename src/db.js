require('dotenv').config()
const pool = process.env.POOL

let {Client, Pool} = require('pg')

const db = new Pool({connectionString: pool})

module.exports = db