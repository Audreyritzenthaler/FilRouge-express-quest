const express = require('express')
const router = express.Router()
const dotenv = require('dotenv')
dotenv.config()
const connection = require('../config/database')

router.get('/', (req, res) => {
    const sql = `SELECT * FROM family`

    connection.query(sql, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Failed to retrieve data !' })
        } else {
            return res.status(200).json(results)
        }
    })
})

module.exports = router