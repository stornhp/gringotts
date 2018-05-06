const Discord = require("discord.js");
const bot = new Discord.Client();
const fs = require("fs");
const moment = require("moment");

//JSON Files
let userData = JSON.parse(fs.readFileSync('Storage/userData.json', 'utf8'));

bot.on('ready', () => {
    console.log(`Je suis connecté sous le pseudonyme: ${bot.user.tag} !`);
});

bot.on('message', message => {
    let sender = message.author;
    let prefix = "!"
    if (!userData[sender.id + message.guild.id]) userData[sender.id + message.guild.id] = {}
    if (!userData[sender.id + message.guild.id].money) userData[sender.id + message.guild.id].money = 150.
    if (!userData[sender.id + message.guild.id].lastDaily) userData[sender.id + message.guild.id].lastDaily = "Not Collected";

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error (err);
    })
    
    if (message.content === prefix + "ping") {
        message.channel.send("Pong")
    }

    if (message.content === prefix + "gringotts" || message.content === prefix + "balance") {
        message.channel.send({embed:{
            title: "Gringotts",
            color: 0x0079FF,
            fields: [{
                name: "Propriétaire du Compte",
                value: message.author.username,
                inline: true
            },
            {
                name: "Balance du Compte",
                value:userData[sender.id + message.guild.id].money,
                inline: true
            }]
        }})
    }

    if (message.content === prefix + "paye" || message.content === prefix + "daily") {
        if (userData[sender.id + message.guild.id].lastDaily != moment().format('L')) {
            userData[sender.id + message.guild.id].lastDaily = moment().format('L')
            userData[sender.id + message.guild.id].money += 500;
            message.channel.send({embed: {
                title:'Jour de Paye',
                color: 0x0079FF,
                description:'Vous récoltez 50 Gallions, ajouté à votre account!'
                
            }})
        } else {
            message.channel.send({embed: {
                title:'Jour de Paye',
                color: 0x0079FF,
                description:'Vous avez déjà récolté votre paye. Vous pouvez récolter votre prochaine paye dans' + moment().endOf('jour').fromNow() + '.'
        }})
    }

    fs.writeFile('Storage/userData.json', JSON.stringify(userData), (err) => {
        if (err) console.error(err);
    })
}});

bot.login(process.env.TOKEN);
