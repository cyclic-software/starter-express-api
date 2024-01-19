const express = require('express');
const bodyParser = require('body-parser');
const path = require('path'); // Módulo path para trabalhar com caminhos de arquivo
const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Simulação de banco de dados para armazenar códigos gerados
const codigosDB = [];

// Rota para servir a página inicial
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views', 'index.html'));
    res.send("Deu certo, servidor rodando na porta 3000")
});

// Rota para gerar códigos aleatórios
app.post('/gerar-codigo', (req, res) => {
    const novoCodigo = Math.random().toString(36).substring(2, 10).toUpperCase();
    codigosDB.push(novoCodigo);
    res.json({ codigo: novoCodigo });
});

// Rota para consulta de código
app.get('/consulta/:codigo', (req, res) => {
    const codigoRastreio = req.params.codigo;
    if (codigosDB.includes(codigoRastreio)) {
        // Lógica de simulação para trajetórias aleatórias
        const trajetorias = ["Saiu para entrega", "Chegou ao centro de distribuição", "Em trânsito"];
        const trajetoriaAleatoria = trajetorias[Math.floor(Math.random() * trajetorias.length)];
        res.json({ status: trajetoriaAleatoria });
    } else {
        res.status(404).json({ mensagem: 'Código de rastreio não encontrado' });
    }
});

// Inicie o servidor
app.listen(port, () => {    console.log("Servidor rodando ")});
