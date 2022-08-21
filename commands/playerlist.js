const Discord = require('discord.js');
const prefix = 'wop!'
const { MessageActionRow, MessageSelectMenu } = require('discord.js');

module.exports = {
	name: 'playerlist',
	description: 'Команда для просмотра активных игроков. Можно использовать только в игровом чате, когда сервер включен. Само *wop!playerlist* **не работает**! Используйте просто `Playerlist`!',
	category: 'info'
}
