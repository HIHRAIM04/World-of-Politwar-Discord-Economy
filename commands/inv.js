const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
	name: 'inv',
	description: 'Посмотреть свой инвентарь.',
    category: 'economy',
	execute(message, args) {
		var users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
        var shop = JSON.parse(fs.readFileSync("./shop.json", "utf8"))["array"];
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
        inv(argsUser)
        function inv(user) {
            var text = ''
            if(!users[user.id]) {
                createWallet(user.id)
            }
            var inv = users[user.id].inv
            if(!inv || !inv[0]) {
                text += 'Инвентарь пуст.'
            } else {
                for(let a in inv) {
                    let b = parseInt(a)+1
                    text += `\`${b}\`. \`${shop[inv[a].id].name}\` - \`${inv[a].number}\`\n`
                }
            }
            let invMess = new Discord.MessageEmbed()
                .setTitle(`Инвентарь ${user.username}`)
                .setDescription(text)
                .setColor('RANDOM')
            message.channel.send({embeds: [invMess]})
        }
        function createWallet(id) {
            users[id] = {
                dollars: 0,
                inv: []
            }
            fs.writeFile("./users.json", JSON.stringify(users), (err) => { // Всё сохраняется в .json файле
                if (err) console.log(err)
            });
        }
	},
};
