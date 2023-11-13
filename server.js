const express=require("express");
const mysql=require('mysql');
const cors=require('cors');

const app=express();
app.use(cors());
app.use(express.json());

const db=mysql.createConnection({
    host:"sql12.freemysqlhosting.net",
    user:"sql12661216",
    password:"RYz25QYwBj",
    database:"sql12661216"
})

app.post('/signup', (req, res) => {
    console.log('Received data:', req.body);

    const sql = "INSERT INTO users (`name`, `email`, `password`) VALUES (?, ?, ?)";
    const values = [req.body.name, req.body.email, req.body.password];
    db.query(sql, values, (err, data) => {
        if (err) {
            console.error('Error inserting into database:', err);
            return res.json("Error");
        }
        console.log('Data inserted into database:', data);
        return res.json(data);
    });
});


app.post('/login', (req, res) => {
    console.log('Received data:', req.body);

    const sql = "SELECT * FROM users WHERE `email` = ? AND `password` = ?";
    db.query(sql, [req.body.email, req.body.password], (err, result) => {
        if (err) {
            return res.json("Error");
        }
        if (result.length > 0) {
            // User authenticated successfully
            return res.json("Success");
        } else {
            // User not found or password incorrect
            return res.json("Failed");
        }
    });
});


app.listen(8081,()=>{
    console.log("Server is listening on port 8081");
})