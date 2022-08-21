const Discord = require('discord.js')
const { MessageActionRow, MessageSelectMenu } = require('discord.js');
const fs = require('fs')
module.exports = {
	name: 'shop',
	description: 'Команда магазина.',
    category: 'economy',
	execute(message, args) {
        var shop = JSON.parse(fs.readFileSync("./shop.json", "utf8"))["array"];
        var pages = [[]]
        var min = 0
        var max = 9
        var a = 0
        var b = 0
        while(shop[a]) {
            for(a; a < max+1 && shop[a]; ++a) {
                pages[b].push(shop[a])
            }
            pages.push([])
            b++
            min+=10
            max+=10
            a=min
        }
        pages.pop()
        somePage(null, 0)
        function somePage(msg, id) {
            let text = ""
            if(!pages[id][0]) text += "Пустая страница"
            else {
                for(let a in pages[id]) {
                    let c = a
                    text += `\`${parseInt(c)+1+(id*10)}.\` \`${pages[id][a].name}\` - ${pages[id][a].cost}:dollar:\n`
                }
            }
            let pageMess = new Discord.MessageEmbed()
                .setTitle(`Магазин. Страница ${parseInt(id)+1}`)
                .setDescription(text)
                .setColor('RANDOM')
            var options = []
            for(let p in pages) {
                let option = {
                    label: `Страница ${parseInt(p) + 1}`,
                    value: p+""
                }
                if(p == id) option.default = true
				options.push(option)
            }
            const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId(id+"")
						.setPlaceholder('Ничего не выбрано')
						.addOptions(options),
				);

			if(msg == null) {
				message.channel.send({embeds: [pageMess], components: [row]}).then(mess => collector(mess))
			} else {
				msg.edit({embeds: [pageMess], components: [row]}).then(mess => collector(mess))
			}
        }
        function collector(mess) {
			const filter = (interaction) => interaction.user.id === message.author.id;
			const collector = mess.createMessageComponentCollector({ filter, time: 60000, max: 1 });
			collector.on('collect', i => {
				i.deferUpdate()
				somePage(mess, i.values[0])
			});
			collector.on('end', collected => '');
		}
	},
};
