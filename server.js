const express = require('express')
const routes = require('./routes/index')
const dotenv = require('dotenv')
dotenv.config()
const app = express()
const cors = require('cors')

const port = process.env.PORT || 8000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/family', routes.family)

app.get('/', (req, res) => {
  res.send({ message: 'YES successfully connected!' })
})

app.listen(port, error => {
  if (error) {
    console.log('Something bad happened...', error)
  } else {
    console.log(`server is listening on port ${port}`)
  }
})
