const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
	name: 'work2',
	description: 'Команда для получения ежедневного бонуса (100 фунтов).',
    category: 'economy2',
	execute(message, args) {
		var users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
        let cooldown = 86400000; // 24 часа в мс
        var lastDaily
        if(users[message.author.id]) lastDaily = users[message.author.id].bonus
        else lastDaily = null

        if (lastDaily !== null && cooldown - (Date.now() - lastDaily) > 0) {
        // Если на пользователя всё ещё действует кулдаун
        let timeObj = cooldown - (Date.now() - lastDaily);
        let timeH = Math.trunc(timeObj / 60000 / 60)
        message.channel.send(`Возвращайтесь через ${timeH} ${checkHours(timeH)}`)
        } else {
            let bonus = 100
            if(!users[message.author.id]) {
                users[message.author.id] = {
                    pounds: bonus,
                    bonus: Date.now()
                }
            } else if(!(users[message.author.id].pounds || users[message.author.id].bonus || (users[message.author.id].pounds && users[message.author.id].bonus))){
                users[message.author.id].pounds = bonus
                users[message.author.id].bonus = Date.now()
            } else {
              users[message.author.id].pounds += bonus
                users[message.author.id].bonus = Date.now()
            }
            fs.writeFile("./users.json", JSON.stringify(users), (err) => { // Всё сохраняется в .json файле
                if (err) console.log(err)
            });
            let bonusMess = new Discord.MessageEmbed()
                .setTitle('Ежедневный бонус фунтов')
                .setDescription(`Собрано ${bonus} :pound:`)
            message.channel.send({embeds: [bonusMess]})
        }
        function checkHours(hours) {
          let word = "час"
          let servers = hours + ""
          let s = servers.length - 1
          if(servers[s] > 1 && servers[s] < 5) {
            word += "а"
          } else if(servers[s] != 1) {
            word += "ов"
          }
          let string = `${word}`
          return string
        }
	},
};
