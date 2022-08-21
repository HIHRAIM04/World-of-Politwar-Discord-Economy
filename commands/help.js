const Discord = require('discord.js');
const prefix = 'wop!'
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
	name: 'help',
	description: 'Список всех команд или информация об определенной',
	aliases: ['commands', 'помощь', 'команды'],
	usage: 'ничего / [имя команды]',
	category: 'info',
	cooldown: 5,
	execute(message, args) {
		const data = [];
		const { commands } = message.client;

		if (!args.length) {
			allCommands(null)
		} else {
			someCommand(null, args[0])
		}

		function allCommands(msg) {
			commands.economy = commands.filter(command => command.category == 'economy')
      commands.economy2 = commands.filter(command => command.category == 'economy2')
			commands.info = commands.filter(command => command.category == 'info')
			let commandsText = commands.info.map(c => `• \`${c.name}\``).join('\n') + '\n**Экономика первого сервера**\n' + commands.economy.map(c => `• \`${c.name}\``).join('\n') + '\n**Экономика второго сервера**\n' + commands.economy2.map(c => `• \`${c.name}\``).join('\n')
			let helpEmbed = new Discord.MessageEmbed()
				.setTitle('Список команд')
				.setDescription('**Инфо**\n' + commandsText + `\n\nИспользуйте префикс *wop!* перед названием команды. Также Вы можете отправить \`${prefix}help [имя команды]\` чтобы получить информацию о ней!`)
				.setColor('RANDOM')
			let options = [
				{
					label: 'Все команды',
					value: 'all',
					default: true
				}
			]
			commands.map(c => {
				if(!c.name) return
				let per = true;
				let IDs = true
				if(c.permissions) {
					let a = c.permissions;
					let b = message.member.permissions.toArray();
					for(let e in a) {
						if(!b.includes(a[e])) {
							per = false;
						} else per = true;
					};
				}
				if(c.IDs) {
					if(!c.IDs.includes(message.author.id)) {
						IDs = false;
					} else IDs = true;
				}
				let option = {
					label: `Команда ${c.name}`,
					value: c.name,
				}
				if(per && IDs) options.push(option)
			})
			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId('all')
						.setPlaceholder('Ничего не выбрано')
						.addOptions(options),
				);
			if(msg == null) {
				message.channel.send({embeds: [helpEmbed], components: [row]}).then(mess => collector(mess))
			} else {
				msg.edit({embeds: [helpEmbed], components: [row]}).then(mess => collector(mess))
			}
		}
		function someCommand(msg, commandName) {
			const name = commandName.toLowerCase();
			const command = commands.get(name) || commands.find(c => c.aliases && c.aliases.includes(name));

			if (!command) {
				return message.reply({content: 'Такой команды не существует!'});
			}
			let helpCmess = new Discord.MessageEmbed()
				.setTitle(`Команда ${command.name}`)
				.setColor('RANDOM')
			if (command.aliases) helpCmess.addField(`**Ключевые слова**`, `${command.aliases.join(', ')}`)
			if (command.description) helpCmess.addField(`**Описание**`, `${command.description}`);
			if (command.usage) helpCmess.addField(`**Использование**`, `${prefix}${command.name} ${command.usage}`);
			helpCmess.addField(`**Перерыв между использованиями**`, `${command.cooldown || 3} секунды`);

			let options = [
				{
					label: 'Все команды',
					value: 'all',
				}
			]
			commands.map(c => {
				if(!c.name) return
				let option = {
					label: `Команда ${c.name}`,
					value: c.name,
				}
				if(c.name == command.name) option.default = true
				options.push(option)
			})
			const row = new MessageActionRow()
				.addComponents(
					new MessageSelectMenu()
						.setCustomId(command.name)
						.setPlaceholder('Ничего не выбрано')
						.addOptions(options),
				);

			if(msg == null) {
				message.channel.send({embeds: [helpCmess], components: [row]}).then(mess => collector(mess))
			} else {
				msg.edit({embeds: [helpCmess], components: [row]}).then(mess => collector(mess))
			}
		}
		function collector(mess) {
			const filter = (interaction) => interaction.user.id === message.author.id;
			const collector = mess.createMessageComponentCollector({ filter, time: 60000, max: 1 });
			collector.on('collect', i => {
				i.deferUpdate()
				if(i.values[0] == 'all') {
					allCommands(mess)
				} else {
					someCommand(mess, i.values[0])
				}
			});
			collector.on('end', collected => '');
		}
	},
};
