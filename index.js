const express = require('express')
const discors = require("discord.js");
const client = new discors.Client({
    intents: ["GUILDS", "GUILD_MESSAGES"],
});

let message1 = "Sa";

client.on('ready', () => {
    console.log("Bot Running...");
    client.user.setActivity("Minecraft", { //Bot hesabının aktivitesini "Bu bot da Discord'a katıldı!" olarak ayarla
        type: "PLAYING" //Aktivite tipi: Oynuyor
    });
});

client.on('message', message => {
    //Test!
    //console.log(message.author.username);
    //if(message.channel.name === '「💻」bot-komut') {
        //if(message.author.username !== 'Web Bot') {
            //message.reply("Sa Kanka");
        //}
        
    //}

    //Komutlar
    if(message.channel.name === '「💻」bot-komut') {
        if(message.author.username !== 'Web Bot') {
            if(message.content === "!help") {message.reply("Komutlar: !html,!help,!site")}

            var command = message.content.match(/\!html ([0-500a-zA-Z-_]+)/);
            try {
               if(command[0] && command[1]) {
                   message.reply("Tamamlandı! G.Öge:" + command[1]);
                   message1 = command[1];
               }
            } catch (error){
                console.log(error);
               return;
            }
            
        }
        
    }
    
})

const app = express()

app.set('view engine', 'ejs')
app.all('/', (req, res) => {
    const meg = message1;
    console.log("Just got a request!")
    res.render("index",{
        message: meg
    })
})
app.listen(process.env.PORT || 3000)

client.login("MTEzMTY0MDI5NjcyODQ0NDkyOA.GW0nV8.zYQBsbqIhsvBKh2ND69DWLJFWxJ2OmsuICckSM");