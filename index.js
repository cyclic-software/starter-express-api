import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';
import cors from 'cors';

//Data-base Connection
const dbUrl = "mongodb+srv://FelipeMDuarte:35624652Fenix-@cluster0.jl61ifv.mongodb.net/?retryWrites=true&w=majority";
const ConnectionParams = {
    useNewUrlParser: true,
    useUnifiedTopology: true
}
mongoose.connect(dbUrl, ConnectionParams).then(()=>{
    console.log("Foi conectado com sucesso")
}).catch((error)=>{
    console.log("Um defeito ocorreu: em quanto conectava", error)
})

const app = express();

app.use(cors())

app.use(express.json());
import session from 'express-session';
app.use(session({
    secret:"831ur9f7uunm@:1#rjjmjfna-042c-admin@outlook.com-35624652Fenix-",
    resave:false,
    saveUninitialized: true,
    cookie: {maxAge:3600000}
}))
app.use(routes);





app.listen(process.env.PORT || 3000)
