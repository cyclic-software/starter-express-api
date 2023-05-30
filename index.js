const http = require('http');
const url = require('url');

const server = http.createServer((req, res) => {

    req.query = url.parse(req.url, true).query;
    const radius = req.query.radius;

    if (radius === undefined) {
        res.statusCode = 400;
        res.setHeader('Content-Type', 'text/plain');
        res.end('Nama: Vincent Sompie\nNIM: 210211060120\n\nError: Silahkan memasukkan parameter radius pada request query.\n');
    } else {
        const area = Math.PI * radius ** 2;
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Nama: Vincent Sompie\nNIM: 210211060120\n\nLuas lingkaran dengan jari-jari ${radius} adalah ${area}.\n`);
    }
});

const PORT = 3000

server.listen(PORT, () => {
    console.log(`Server up and running at port ${PORT}`);
});
