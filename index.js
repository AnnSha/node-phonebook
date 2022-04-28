const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')


// const mongoose = require('mongoose')
//
// if (process.argv.length < 3) {
//     console.log('Please provide the password as an argument: node mongo.js <password>')
//     process.exit(1)
// }
//
// const password = process.argv[2]
//
// const url =
//     `mongodb+srv://AnnSha:${password}@cluster0.luaxf.mongodb.net/phonebookApp?retryWrites=true&w=majority`
//
// mongoose.connect(url)
//
// const personSchema = new mongoose.Schema({
//     name: String,
//     number: String,
//     date: Date,
//
// })
//
// const Person = mongoose.model('Person', personSchema)

// let persons =
//     [
//         {
//             "id": 1,
//             "name": "Arto Hellas",
//             "number": "040-123456"
//         },
//         {
//             "id": 2,
//             "name": "Ada Lovelace",
//             "number": "39-44-5323523"
//         },
//         {
//             "id": 3,
//             "name": "Dan Abramov",
//             "number": "12-43-234345"
//         },
//         {
//             "id": 4,
//             "name": "Mary Poppendieck",
//             "number": "39-23-6423122"
//         }
//     ]

const requestLogger = (request, response, next) => {
    console.log('Method:', request.method)
    console.log('Path:  ', request.path)
    console.log('Body:  ', request.body)
    console.log('---')
    next()
}
app.use(express.static('build'))
app.use(express.json())
app.use(requestLogger)
app.use(cors())
app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>')
})


app.get('/info', (request, response) => {

const info = Person.length

    response.send(`<p>Phonebook has info for  ${info} people</p>
                             <p>${new Date()}</p>` )

})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})
app.get('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // const person = persons.find(person => person.id === id)
    // if (person) {
    //     response.json(person)
    // } else {
    //     response.status(404).end()
    // }
    Person.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {
    // const id = Number(request.params.id)
    // persons = persons.filter(person => person.id !== id)
    //
    // response.status(204).end()
    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))


})
const generateId = () => {

    return Math.floor(Math.random() *10000)
}

app.post('/api/persons', (request, response) => {
    const body = request.body

    if (!body.name ) {
        return response.status(400).json({
            error: 'name must be included'
        })
    }
    if (!body.number ) {
        return response.status(400).json({
            error: 'number must be included'
        })
    }
    // if (body.filter(e => e.name === body.name ).length) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }
    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateId(),
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })

    // persons = persons.concat(person)
    // response.json(person)
})


const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }

    next(error)
}

// this has to be the last loaded middleware.
app.use(errorHandler)


// const PORT = process.env.PORT || 3001
// app.listen(PORT)
// console.log(`Server running on port ${PORT}`)

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
