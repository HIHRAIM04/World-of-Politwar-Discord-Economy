const Discord = require('discord.js')
const fs = require('fs')
module.exports = {
	name: 'give-ib',
	description: 'Команда для передачи денег израильского банка другому участнику. Чтоб передать деньги другому участнику, используйте: `wop!give-ib money "Пинг участника" "Кол-во денег"`.',
    category: 'economy',
	execute(message, args) {
		var users = JSON.parse(fs.readFileSync("./users.json", "utf8"));
        var shop = JSON.parse(fs.readFileSync("./shop.json", "utf8"))["array"];
        var argsUser
        if(!args[0]) return message.channel.send('Вы не указали вид действия!')
        if(!message.mentions.users.first()){
			if(!args[1]) {
                return message.channel.send({content: "Вы не можете передать деньги самому себе!"})
            } else {
                argsUser = message.guild.members.resolve(args[1])
                if(!argsUser) return message.channel.send('Укажите действительного пользователя!')
            }
		}
		else {
			argsUser = message.mentions.users.first();
		}
        if(!users[argsUser.id]) {
            createWallet(argsUser.id)
        }
        if(!users[argsUser.id].inv) {
            users[argsUser.id].inv = []
            fs.writeFile("./users.json", JSON.stringify(users), (err) => { // Всё сохраняется в .json файле
                if (err) console.log(err)
            });
        }
        if(args[0] == 'money') {
            if(!args[2] || parseInt(args[2]) < 1 || isNaN(parseInt(args[2]))) return message.channel.send({content: "Укажите количество долларов, которое вы хотите передать!"})
            if(parseInt(args[2]) > users[message.author.id].shekels || !users[message.author.id || parseInt(args[2]) < 1]) return message.channel.send({content: "У вас недостаточно долларов для совершения операции!"})
            giveToWallet(argsUser.id, parseInt(args[2]))
            let giveMess = new Discord.MessageEmbed()
                .setDescription(`${args[2]} ₪ передано в кошелёк ${argsUser}`)
                .setColor('00ff00')
                .setThumbnail(message.author.displayAvatarURL())
            message.channel.send({embeds: [giveMess]})
        } else if(args[0] == 'item') {
            giveToInv(argsUser.id, args[2])
        }
        function giveToWallet(id, shekels) {
            users[message.author.id].shekels -= shekels
            users[id].shekels += shekels
            fs.writeFile("./users.json", JSON.stringify(users), (err) => { // Всё сохраняется в .json файле
                if (err) console.log(err)
            });
        }
        function giveToInv(id, oid) {
            if(!shop[parseInt(oid) - 1]) return message.channel.send('Введите верный id предмета!')
            if(!users[id]) createWallet(id)
            let searchElement = users[message.author.id].inv.find(i => i.id == (parseInt(oid) - 1))
            if(!searchElement) return message.channel.send({content: "У вас нет этого предмета!"})
            let index = users[message.author.id].inv.indexOf(searchElement)
            let searchEl = users[id].inv.find(i => i.id == (parseInt(oid) - 1))
            if(searchEl) {
              let i = users[id].inv.indexOf(searchEl)
              users[id].inv[i].number++
            } else users[id].inv.push(item(parseInt(oid) - 1))
            if(users[message.author.id].inv[index].number < 2) {
              users[message.author.id].inv.splice(index, 1) 
            }
            else users[message.author.id].inv[index].number--
            fs.writeFile("./users.json", JSON.stringify(users), (err) => { // Всё сохраняется в .json файле
                if (err) console.log(err)
            });
            let giveMess = new Discord.MessageEmbed()
                .setDescription(`Вы передали \`${shop[parseInt(oid) - 1].name}\` <@${id}>`)
                message.channel.send({embeds: [giveMess]})
        }
        function createWallet(id) {
            users[id] = {
                shekels: 0,
                inv: []
            }
            fs.writeFile("./users.json", JSON.stringify(users), (err) => { // Всё сохраняется в .json файле
                if (err) console.log(err)
            });
        }
        function item(id) {
            return({
                id: id,
                number: 1
            })
        }
	},
};
