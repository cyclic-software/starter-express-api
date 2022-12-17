import express from 'express';
import mongoose from 'mongoose';
import routes from './routes.js';
import cors from 'cors';

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

app.use(routes);





app.listen(process.env.PORT || 3000)
