const express = require('express')
const routes = require('./routes/index')
const app = express()
const cors = require('cors')

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.use('/family', routes.family)

app.get('/', (req, res) => {
  res.send({ message: 'YES successfully connected!' })
})

// don't forget to create index in folder "route"
// with module.exports ;)

app.listen(process.env.PORT, error => {
  if (error) {
    console.log('Something bad happened...', error)
  } else {
    console.log(`server is listening on port ${process.env.PORT}`)
  }
})
