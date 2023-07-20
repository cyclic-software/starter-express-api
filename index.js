const express = require('express')
const discord = require('discord.js')
const client = discord.client();

const message1 = "<title>Mesaj Boş</title><p>Sa</p>";

client.on('ready', () => {
    console.log("Bon Running...");
});

client.on('message', message => {
    if(message.content === "!help") {
        message.reply("Komutlar: !help, !site, !degistir");
    }
    if(message.content === "!site") {
        message.reply("Site : https://lovely-boot-dove.cyclic.app/");
    }
});

const app = express()
app.all('/', (req, res) => {
    console.log("Just got a request!")
    res.send(message1)
})
app.listen(process.env.PORT || 3000)

client.login('MTEzMTY0MDI5NjcyODQ0NDkyOA.G-lYhg.IKa0YhIbnrJEZjYd179K-5VG1AG926nfmOxDBA');