const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
	name: 'wallet',
	description: 'Команда для проверки кошелька.',
    category: 'info',
	execute(message, args) {
		var users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
        var argsUser
        if(!message.mentions.users.first()){
			if(!args[0]) {
                argsUser = message.author;
            } else {
                argsUser = message.guild.members.resolve(args[0])
                if(!argsUser) argsUser = message.author
            }
		}
		else {
			argsUser = message.mentions.users.first();
		}
        if(!users[argsUser.id]) {
            createWallet(argsUser.id)
        }
        let walletMess = new Discord.MessageEmbed()
            .setTitle(`Кошелек ${argsUser.username}`)
            .setDescription(`**World of Politwar**:\n${users[argsUser.id].dollars} :dollar:\n${users[argsUser.id].shekels} ₪\n${users[argsUser.id].agors} ℵ\n**World of Politwar 2**:\n${users[argsUser.id].pounds} :pound:` )
            .setFooter('"undefined" означает, что у участника нет той валюты.')
            .setColor('RANDOM')
            .setThumbnail(message.author.displayAvatarURL())
        message.channel.send({embeds: [walletMess]})
        function createWallet(id) {
            users[id] = {
                dollars: 0
            }
            fs.writeFile("./users.json", JSON.stringify(users), (err) => { // Всё сохраняется в .json файле
                if (err) console.log(err)
            });
        }
	},
};
