const express = require('express')
const app = express()
const PORT = 3000
const cors = require('cors')

app.use(cors())

const rappers = {    
    '21 savage': {
        'age': 29,
        'birthName': 'Sheyaa Bin Abraham-Joseph',
        'birthLocation': 'London, England'
    },
    'chance the rapper': {
        'age': 29,
        'birthName': 'Chancelor Bennett',
        'birthLocation': 'Chicago, Ill'
    },
    'unknown': {
        'age': 0,
        'birthName': 'unknown',
        'birthLocation': 'unknown'
    }
}

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html')
})

app.get('/api/:name',(req, res) =>{
    const rapperName = req.params.name.toLowerCase()
    //console.log(rappers[rapperName].birthName)
    if(rappers[rapperName]){
        res.json(rappers[rapperName])
    }else res.json(rappers['unknown'])
})

app.listen(process.env.PORT || PORT, ()=>{
    console.log(`The server is now running on port ${PORT}! Betta Go Catch It!`)
}) 

// app.all('/', (req, res) => {
//     console.log("Just got a request!")
//     res.send('BetterBytes!')
// })
