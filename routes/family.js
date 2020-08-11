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

router.get('/name', (req, res) => {
    const sql = `SELECT name FROM family`

    connection.query(sql, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Failed to retrieve data !' })
        } else {
            return res.status(200).json(results)
        }
    })
})

router.get('/filterdate', (req, res) => {
    let sqlQuery = `SELECT * FROM family`
    const sqlValues = []

    if (req.query.birthDate) {
        sqlQuery += ' WHERE birthDate > ?'
        sqlValues.push(req.query.birthDate)
    }

    connection.query(sqlQuery, sqlValues, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Failed to retrieve data !' })
        } else {
            return res.status(200).json(results)
        }
    })
})

// Filter by name 'begin by ...'

router.get('/begin', (req, res) => {
    let sqlQuery = `SELECT * FROM family`

    if (req.query.name) {
        sqlQuery += " WHERE name LIKE CONCAT(?, '%')"
    }

    connection.query(sqlQuery, req.query.name, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Failed to retrieve data !' })
        } else {
            return res.status(200).json(results)
        }
    })
})

// Filter by name 'contains ...'

router.get('/contains', (req, res) => {
    let sqlQuery = `SELECT * FROM family`

    if (req.query.name) {
        sqlQuery += ' WHERE name LIKE ' + connection.escape('%' + req.query.name + '%')
    }

    connection.query(sqlQuery, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to retrieve data !' })
        } else {
            return res.status(200).json(results)
        }
    })
})

router.get('/:sort', (req, res) => {
    const order = req.params.sort
    let sqlQuery = `SELECT * FROM family ORDER BY name ${order}`

    connection.query(sqlQuery, (error, results) => {
        if (error) {
            console.log(error)
            return res.status(500).json({ error: 'Failed to retrieve data !' })
        } else {
            return res.status(200).json(results)
        }
    })
})

router.post('/', (req, res) => {
    const values = req.body
    const sqlAdd = `INSERT INTO family SET ?`

    connection.query(sqlAdd, values, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to retrieve data' })
        } else {
            const sqlReturn = `SELECT * FROM family WHERE id = ?`
            return connection.query(sqlReturn, results.insertId, (error, records) => {
                if (error) {
                    res.status(500).json({ error: 'Failed to retrieve data' })
                } else {
                    const insertedMember = records[0]
                    const {id, ...family} = insertedMember
                    const host = req.get('host')
                    const location = `http://${host}${req.url}/${family.id}`
                    return res.status(201).set('Location', location).json(family)
                }
            })
        }
    })
})

router.put('/:id', (req, res) => {
    const idMember = req.params.id
    const updatedData = req.body
    const sql = `UPDATE family SET ? WHERE id = ?`

    connection.query(sql, [updatedData, idMember], (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to modify data' })
        } else {
            const sqlReturn = `SELECT * FROM family WHERE id = ?`
            return connection.query(sqlReturn, idMember, (error, records) => {
                if (error) {
                    res.status(500).json({ error: 'Failed to retrieve data' })
                } else {
                    const modifiedMember = records[0]
                    const {id, ...family} = modifiedMember
                    return res.status(201).json(family)
                }
            })
        }
    })
})

router.put('/toggle/:id', (req, res) => {
    const idMember = req.params.id
    const sqlToggle = `UPDATE family SET isRitzenthaler = isRitzenthaler XOR 1 WHERE id=${idMember}`

    connection.query(sqlToggle, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to change last name' })
        } else {
            const sqlReturn = `SELECT * FROM family WHERE id = ?`
            return connection.query(sqlReturn, idMember, (error, records) => {
                if (error) {
                    res.status(500).json({ error: 'Failed to retrieve data' })
                } else {
                    const modifiedMember = records[0]
                    const {idMember, ...family} = modifiedMember
                    return res.status(201).json(family)
                }
            })
        }
    })
})

router.delete('/:id', (req, res) => {
    const id = req.params.id
    const sql = `DELETE FROM family WHERE id=${id}`

    connection.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to delete this member' })
        } else {
            return res.status(200).json({ results: 'Member deleted' })
        }
    })
})

router.delete('/', (req, res) => {
    const sql = `DELETE FROM family WHERE isRitzenthaler=0`

    connection.query(sql, (error, results) => {
        if (error) {
            return res.status(500).json({ error: 'Failed to delete member all non-Ritzenthaler members' })
        } else {
            return res.status(200).json({ results: 'Members deleted' })
        }
    })
})

module.exports = router
