require('dotenv').config()
const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://AnnSha:${password}@cluster0.luaxf.mongodb.net/phonebookApp?retryWrites=true&w=majority`

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    date: Date,

})

const Person = mongoose.model('Person', personSchema)

const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
    date: new Date(),

})
if (process.argv[3]) {
    person.save().then(persons => {
        console.log(`added ${persons.name} number ${persons.number} to phonebook`)
        mongoose.connection.close()
    })
}

if (process.argv.length === 3) {
    Person.find({}).then(result => {
        result.forEach(persons => {

            console.log(`${persons.name} ${persons.number}`)

        })
        mongoose.connection.close()
    })
}
