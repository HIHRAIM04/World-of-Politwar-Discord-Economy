const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
	name: 'top2',
	description: 'Топ участников World of Politwar 2 по деньгам.',
    category: 'economy2',
	execute(message, args) {
		var users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
        let usersMass = Object.entries(users);
        usersMass = setTop(usersMass.sort(compareNumbers).slice(0, 10))
        let topMess = new Discord.MessageEmbed()
            .setTitle('Топ участников World of Politwar 2')
            .setDescription(usersMass)
            .setColor('RANDOM')
        message.channel.send({embeds: [topMess]})
        function setTop(arr) {
            let text = ''
            for(let a in arr) {
                let b = parseInt(a) + 1
                text += `\`${b}\`. <@${arr[a][0]}> - \`${arr[a][1].pounds}\`:pound:\n`
            }
            return text
        }
        function compareNumbers(a, b) {
            return b[1].pounds - a[1].pounds;
        }
	},
};
