const express = require('express')
const app = express()
const cors = require('cors')
const MongoClient = require('mongodb').MongoClient
require('dotenv').config()
const PORT = 3000
app.use(cors())
app.set('view engine','ejs')
app.use(express.static('public'))
app.use(express.urlencoded({ extended: true}))
app.use(express.json())

let db,
    dbConnectionStr = 'mongodb+srv://jonathankbyers:02S6kDc3hv9J0oMX@testingcluster.wdoczch.mongodb.net',
    dbName = 'rap'

MongoClient.connect(dbConnectionStr)
    .then(client => {
        console.log(`Connected to ${dbName} Database`)
        db = client.db(dbName)
    })


app.get('/',async (request, response)=>{
    const todoItems = await db.collection('todos').find().toArray()
    const itemsLeft = await db.collection('todos').countDocuments({completed: false})
    response.render('index.ejs', { items: todoItems, left: itemsLeft })
    // db.collection('todos').find().toArray()
    // .then(data => {
    //     db.collection('todos').countDocuments({completed: false})
    //     .then(itemsLeft => {
    //         response.render('index.ejs', { items: data, left: itemsLeft })
    //     })
    // })
    // .catch(error => console.error(error))
})

app.post('/addTodo', (request, response) => {
    db.collection('todos').insertOne({thing: request.body.todoItem, completed: false})
    .then(result => {
        console.log('Todo Added')
        response.redirect('/')
    })
    .catch(error => console.error(error))
})

app.put('/markComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: true
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.put('/markUnComplete', (request, response) => {
    db.collection('todos').updateOne({thing: request.body.itemFromJS},{
        $set: {
            completed: false
          }
    },{
        sort: {_id: -1},
        upsert: false
    })
    .then(result => {
        console.log('Marked Complete')
        response.json('Marked Complete')
    })
    .catch(error => console.error(error))

})

app.delete('/deleteItem', (request, response) => {
    db.collection('todos').deleteOne({thing: request.body.itemFromJS})
    .then(result => {
        console.log('Todo Deleted')
        response.json('Todo Deleted')
    })
    .catch(error => console.error(error))

})


// const rappers = {    
//     '21 savage': {
//         'age': 29,
//         'birthName': 'Sheyaa Bin Abraham-Joseph',
//         'birthLocation': 'London, England'
//     },
//     'chance the rapper': {
//         'age': 29, 
//         'birthName': 'Chancelor Bennett',
//         'birthLocation': 'Chicago, Ill'
//     },
//     'unknown': {
//         'age': 0,
//         'birthName': 'unknown',
//         'birthLocation': 'unknown'
//     }
// }
// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/index.html')
// })

// app.get('/api/:name',(req, res) =>{
//     const rapperName = req.params.name.toLowerCase()
//     //console.log(rappers[rapperName].birthName)
//     if(rappers[rapperName]){
//         res.json(rappers[rapperName])
//     }else res.json(rappers['unknown'])
// })

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`The server is now running on port ${PORT}! Betta Go Catch It!`)
}) 

// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('BetterBytes!')
// })
