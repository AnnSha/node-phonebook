const express = require('express')
const app = express()
const cors = require('cors')
require('dotenv').config()
const Person = require('./models/person')



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

Person.count().then(info =>{
    response.send(`<p>Phonebook has info for  ${info} people</p>
                             <p> ${new Date()} </p>` )
})
})

app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})
app.get('/api/persons/:id', (request, response, next) => {

    Person.findById(request.params.id)
        .then(person => {
            response.json(person)
        })
        .catch(error => next(error))
})
app.delete('/api/persons/:id', (request, response, next) => {

    Person.findByIdAndRemove(request.params.id)
        .then(result => {
            response.status(204).end()
        })
        .catch(error => next(error))


})
const generateId = () => {
    return Math.floor(Math.random() *10000)
}

app.post('/api/persons', (request, response, next) => {
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
    const person = new Person({
        name: body.name,
        number: body.number,
        date: new Date(),
        id: generateId(),
    })
    person.save().then(savedPerson => {
        response.json(savedPerson)
    })
        .catch(error => next(error))
})
// для update нужно изменить фронт, добавить кнопку.zxcvbhn
app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body

    Person.findByIdAndUpdate(
        request.params.id,
        { name, number },
        { new: true, runValidators: true, context: 'query' }
    )
        .then(updatedPerson => {
            response.json(updatedPerson)
        })
        .catch(error => next(error))
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint.' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.error(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformatted id' })
    }
    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
